import { Link } from 'react-router-dom';
import { getRecentGroups, removeRecentGroup, type RecentGroup } from '@/utils/recentGroups';
import { useI18n } from '@/core/i18n';
import type { Lang } from '@/core/types';

interface RecentGroupsProps {
  lang: Lang;
}

export default function RecentGroups({ lang }: RecentGroupsProps) {
  const { t } = useI18n(lang);
  const recentGroups = getRecentGroups();

  if (recentGroups.length === 0) {
    return null;
  }

  function handleRemove(groupId: string, event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    removeRecentGroup(groupId);
    // Force re-render by triggering a state update in parent
    window.location.reload();
  }

  function formatLastAccessed(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return t('recent.today');
    if (diffDays === 1) return t('recent.yesterday');
    if (diffDays < 7) return t('recent.daysAgo', { days: diffDays });
    return date.toLocaleDateString();
  }

  return (
    <div className="card">
      <h2>{t('home.recentTitle')}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {recentGroups.map((group: RecentGroup) => (
          <Link
            key={group.id}
            to={`/group/${group.id}`}
            className="recent-group-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: '#f7fafc',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
              border: '1px solid #e2e8f0',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#edf2f7';
              e.currentTarget.style.borderColor = '#cbd5e0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f7fafc';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <div>
              <div style={{ fontWeight: '500', marginBottom: '2px' }}>
                {group.name}
              </div>
              <div style={{ fontSize: '12px', color: '#718096' }}>
                {formatLastAccessed(group.lastAccessed)}
              </div>
            </div>
            <button
              onClick={(e) => handleRemove(group.id, e)}
              style={{
                background: 'none',
                border: 'none',
                color: '#a0aec0',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#e53e3e';
                e.currentTarget.style.backgroundColor = '#fed7d7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#a0aec0';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              title={t('recent.remove')}
            >
              ×
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}