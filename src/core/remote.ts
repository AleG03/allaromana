import type { Group, Lang } from './types';

const API_BASE = '';

async function readJson(res: Response) {
  const text = await res.text();
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) throw new Error(text.slice(0, 200));
  return JSON.parse(text);
}

export async function createRemoteGroup(name: string, lang: Lang): Promise<Group> {
  const res = await fetch(`${API_BASE}/api/group`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, lang }),
  });
  if (!res.ok) throw new Error(await res.text());
  return readJson(res) as Promise<Group>;
}

export async function fetchRemoteGroup(groupId: string): Promise<Group | null> {
  const res = await fetch(`${API_BASE}/api/group/${encodeURIComponent(groupId)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(await res.text());
  return readJson(res) as Promise<Group>;
}

export async function saveRemoteGroup(group: Group): Promise<void> {
  const res = await fetch(`${API_BASE}/api/group/${encodeURIComponent(group.id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(group),
  });
  if (!res.ok) throw new Error(await res.text());
}