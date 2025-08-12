import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/core/i18n';
import { deleteRemoteGroup } from '@/core/remote';
import { removeRecentGroup } from '@/utils/recentGroups';
import type { Lang } from '@/core/types';

interface DeleteGroupButtonProps {
  groupId: string;
  lang: Lang;
}

export default function DeleteGroupButton({ groupId, lang }: DeleteGroupButtonProps) {
  const { t } = useI18n(lang);
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(t('group.deleteConfirm'))) return;
    
    try {
      setDeleting(true);
      await deleteRemoteGroup(groupId);
      removeRecentGroup(groupId);
      navigate('/');
    } catch (error: any) {
      alert(`Failed to delete group: ${error.message || error}`);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      className="btn danger small"
      onClick={handleDelete}
      disabled={deleting}
      title={t('group.deleteGroup')}
      style={{
        padding: '6px 8px',
        fontSize: '12px',
        minWidth: 'auto'
      }}
    >
      🗑️
    </button>
  );
}