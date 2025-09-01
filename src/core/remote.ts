import type { Group, Lang } from './types';
import createMockGroup from './mock';

const API_BASE = '';

const USE_MOCKS = (import.meta.env.VITE_USE_MOCKS === '1') || Boolean(import.meta.env.DEV);

async function readJson(res: Response) {
  const text = await res.text();
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) throw new Error(text.slice(0, 200));
  return JSON.parse(text);
}

function mockStorageKey(id: string) {
  return `mock:group:${id}`;
}

function saveMock(group: Group) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(mockStorageKey(group.id), JSON.stringify(group));
    }
  } catch (e) {
    console.warn('Failed to save mock group to localStorage', e);
  }
}

export async function createRemoteGroup(name: string, lang: Lang): Promise<Group> {
  if (USE_MOCKS) {
    const g = createMockGroup(lang);
    g.name = name;
    // ensure unique id for multiple creates
    try {
      g.id = (crypto as any).randomUUID ? (crypto as any).randomUUID() : `mock-${Date.now()}`;
    } catch (_) {
      g.id = `mock-${Date.now()}`;
    }
    saveMock(g);
    return g;
  }

  const res = await fetch(`${API_BASE}/api/group`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, lang }),
  });
  if (!res.ok) throw new Error(await res.text());
  return readJson(res) as Promise<Group>;
}

export async function fetchRemoteGroup(groupId: string): Promise<Group | null> {
  if (USE_MOCKS) {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(mockStorageKey(groupId));
        if (raw) return JSON.parse(raw) as Group;
      }
    } catch (e) {
      console.warn('Failed to read mock group from localStorage', e);
    }
    // fallback: return a new mock with requested id
    const g = createMockGroup('en');
    g.id = groupId || g.id;
    saveMock(g);
    return g;
  }

  console.log('Fetching group:', groupId);
  const url = `${API_BASE}/api/group/${encodeURIComponent(groupId)}`;
  console.log('Request URL:', url);
  
  const res = await fetch(url);
  console.log('Response status:', res.status);
  
  if (res.status === 404) return null;
  if (!res.ok) {
    const errorText = await res.text();
    console.error('API Error:', errorText);
    throw new Error(errorText);
  }
  return readJson(res) as Promise<Group>;
}

export async function saveRemoteGroup(group: Group): Promise<void> {
  if (USE_MOCKS) {
    saveMock(group);
    return;
  }

  const res = await fetch(`${API_BASE}/api/group/${encodeURIComponent(group.id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(group),
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function deleteRemoteGroup(groupId: string): Promise<void> {
  if (USE_MOCKS) {
    try {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(mockStorageKey(groupId));
    } catch (e) {
      console.warn('Failed to delete mock group from localStorage', e);
    }
    return;
  }

  const res = await fetch(`${API_BASE}/api/group/${encodeURIComponent(groupId)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(await res.text());
}