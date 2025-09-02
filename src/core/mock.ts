import type { Group, Member } from './types';

export function createMockMember(name: string, id?: string): Member {
  return {
    id: id ?? `m-${Math.random().toString(36).slice(2, 9)}`,
    name,
    addedAt: new Date().toISOString(),
    isActive: true,
  };
}

export function createMockGroup(lang: Group['lang'] = 'en'): Group {
  const members = [createMockMember('Alice', 'm1'), createMockMember('Bob', 'm2'), createMockMember('Charlie', 'm3')];
  return {
    id: 'mock-group',
    name: 'Mock Group',
    lang,
    members,
    expenses: [],
    settlements: [],
    balances: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
  } as Group;
}

export default createMockGroup;
