import { createClient } from '@supabase/supabase-js';

function sbAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, key, { auth: { persistSession: false } });
}

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const supabase = sbAdmin();
    const { name, lang } = (req.body || {}) as { name?: string; lang?: 'it' | 'en' };

    const { data: group, error } = await supabase
      .from('groups')
      .insert({
        name: (name || 'New Group').toString(),
        lang: lang === 'en' ? 'en' : 'it',
      })
      .select()
      .single();

    if (error) throw error;

    const response = {
      id: group.id,
      name: group.name,
      createdAt: group.created_at,
      updatedAt: group.updated_at,
      members: [],
      expenses: [],
      settlements: [],
      balances: [],
      version: group.version,
      lang: group.lang,
    };

    return res.status(201).json(response);
  } catch (e: any) {
    console.error('POST /api/group error:', e);
    return res.status(500).json({ error: e?.message || 'Server error' });
  }
}