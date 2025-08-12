import type { Group } from '@/core/types';

const RECENT_GROUPS_KEY = 'recentGroups';
const MAX_RECENT_GROUPS = 5;

export interface RecentGroup {
    id: string;
    name: string;
    lastAccessed: string;
}

export function addRecentGroup(group: Group): void {
    const recent: RecentGroup[] = getRecentGroups();

    // Remove existing entry if present
    const filtered = recent.filter(r => r.id !== group.id);

    // Add to beginning
    const updated: RecentGroup[] = [
        {
            id: group.id,
            name: group.name,
            lastAccessed: new Date().toISOString()
        },
        ...filtered
    ].slice(0, MAX_RECENT_GROUPS);

    localStorage.setItem(RECENT_GROUPS_KEY, JSON.stringify(updated));
}

export function getRecentGroups(): RecentGroup[] {
    try {
        const stored = localStorage.getItem(RECENT_GROUPS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

export function removeRecentGroup(groupId: string): void {
    const recent = getRecentGroups();
    const filtered = recent.filter(r => r.id !== groupId);
    localStorage.setItem(RECENT_GROUPS_KEY, JSON.stringify(filtered));
}