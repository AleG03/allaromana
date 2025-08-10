import { createClient } from '@supabase/supabase-js';

interface Member {
  id: string;
  name: string;
  addedAt: string; // ISO
  isActive: boolean;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  participants: string[];
  date: string; // ISO
  createdAt: string; // ISO
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

interface Balance {
  memberId: string;
  netBalance: number;
  settlements: Settlement[];
}

type Lang = 'it' | 'en';

interface Group {
  id: string;
  name: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  members: Member[];
  expenses: Expense[];
  balances: Balance[];
  version: number;
  lang: Lang;
}

const toCents = (v: number) => Math.round(v * 100);
const toMoney = (cents: number) => Math.round(cents) / 100;
const nearlyZero = (cents: number) => Math.abs(cents) < 0.5;

function splitCentsEvenly(totalCents: number, memberIds: string[]): Map<string, number> {
  const n = memberIds.length || 1;
  const base = Math.floor(totalCents / n);
  const remainder = totalCents % n;
  const map = new Map<string, number>();
  const sorted = [...memberIds].sort(); // deterministic
  sorted.forEach((id, idx) => map.set(id, base + (idx < remainder ? 1 : 0)));
  return map;
}

function computeBalances(group: Group): Balance[] {
  const allMembers = group.members;
  const memberIds = allMembers.map(m => m.id);
  const net = new Map<string, number>(memberIds.map(id => [id, 0]));

  const add = (id: string, cents: number) => net.set(id, (net.get(id) || 0) + cents);

  for (const exp of group.expenses) {
    const participants = exp.participants.length ? exp.participants : memberIds;
    const totalCents = toCents(exp.amount);
    const shares = splitCentsEvenly(totalCents, participants);

    for (const pid of participants) add(pid, -(shares.get(pid) || 0));
    add(exp.paidBy, totalCents);
  }

  const creditors: { id: string; cents: number }[] = [];
  const debtors: { id: string; cents: number }[] = [];

  for (const [id, cents] of net.entries()) {
    if (nearlyZero(cents)) continue;
    if (cents > 0) creditors.push({ id, cents });
    else if (cents < 0) debtors.push({ id, cents: -cents });
  }

  creditors.sort((a, b) => b.cents - a.cents);
  debtors.sort((a, b) => b.cents - a.cents);

  const settlements: Settlement[] = [];
  let ci = 0, di = 0;
  while (ci < creditors.length && di < debtors.length) {
    const pay = Math.min(creditors[ci].cents, debtors[di].cents);
    settlements.push({
      from: debtors[di].id,
      to: creditors[ci].id,
      amount: toMoney(pay),
    });
    creditors[ci].cents -= pay;
    debtors[di].cents -= pay;
    if (nearlyZero(creditors[ci].cents)) ci++;
    if (nearlyZero(debtors[di].cents)) di++;
  }

  const byMember: Record<string, Settlement[]> = {};
  for (const s of settlements) {
    byMember[s.from] ??= [];
    byMember[s.from].push(s);
    byMember[s.to] ??= [];
  }

  return memberIds.map(memberId => ({
    memberId,
    netBalance: toMoney(net.get(memberId) || 0),
    settlements: byMember[memberId] || [],
  }));
}

function sbAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, key, { auth: { persistSession: false } });
}

async function fetchGroupData(supabase: any, groupId: string) {

  const { data: group, error: groupError } = await supabase
    .from('groups')
    .select(`
      id,
      name,
      lang,
      created_at,
      updated_at,
      version,
      members (
        id,
        name,
        is_active,
        added_at
      ),
      expenses (
        id,
        description,
        amount_cents,
        paid_by,
        expense_date,
        created_at,
        expense_participants (
          member_id
        )
      )
    `)
    .eq('id', groupId)
    .single();

  if (groupError) {
    if (groupError.code === 'PGRST116') return null;
    throw groupError;
  }


  const expenses = group.expenses.map((exp: any) => ({
    id: exp.id,
    description: exp.description,
    amount: exp.amount_cents / 100,
    paidBy: exp.paid_by,
    participants: exp.expense_participants.map((p: any) => p.member_id),
    date: exp.expense_date,
    createdAt: exp.created_at,
  }));

  const members = group.members.map((member: any) => ({
    id: member.id,
    name: member.name,
    addedAt: member.added_at,
    isActive: member.is_active,
  }));

  const groupData: Group = {
    id: group.id,
    name: group.name,
    createdAt: group.created_at,
    updatedAt: group.updated_at,
    members,
    expenses,
    balances: [],
    version: group.version,
    lang: group.lang,
  };

  groupData.balances = computeBalances(groupData);
  
  return groupData;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');

  const id = typeof req.query?.id === 'string' ? req.query.id : '';
  if (!id) return res.status(400).json({ error: 'Invalid id' });

  try {
    const supabase = sbAdmin();

    if (req.method === 'GET') {
      const groupData = await fetchGroupData(supabase, id);
      if (!groupData) {
        return res.status(404).json({ error: 'Not found' });
      }
      return res.status(200).json(groupData);
    }

    if (req.method === 'PUT') {
      const incoming = req.body;
      if (!incoming || typeof incoming !== 'object' || incoming.id !== id) {
        return res.status(400).json({ error: 'Body must be a Group with matching id' });
      }


      const { error } = await supabase.rpc('update_group_data', {
        p_group_id: id,
        p_group_data: incoming
      });

      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'OPTIONS') return res.status(204).send(null);
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (e: any) {
    console.error(`API /api/group/${id} error:`, e);
    return res.status(500).json({ error: e?.message || 'Server error' });
  }
}