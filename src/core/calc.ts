import type { Balance, Group, Settlement } from './types';

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

export function computeBalances(group: Group): Balance[] {
  const allMembers = group.members;
  const memberIds = allMembers.map(m => m.id);
  const net = new Map<string, number>(memberIds.map(id => [id, 0]));

  const add = (id: string, cents: number) => net.set(id, (net.get(id) || 0) + cents);

  // Process expenses
  for (const exp of group.expenses) {
    const participants = exp.participants.length ? exp.participants : memberIds;
    const totalCents = toCents(exp.amount);
    const shares = splitCentsEvenly(totalCents, participants);

    for (const pid of participants) add(pid, -(shares.get(pid) || 0));
    add(exp.paidBy, totalCents);
  }

  // Process settlements (recorded payments)
  for (const settlement of group.settlements || []) {
    const settlementCents = toCents(settlement.amount);
    add(settlement.from, -settlementCents); // Person who paid reduces their debt
    add(settlement.to, settlementCents); // Person who received increases their credit
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