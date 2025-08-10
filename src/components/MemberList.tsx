import type { Group, Member } from '@/core/types';
import { useMemo, useState } from 'react';
import { useI18n } from '@/core/i18n';

export default function MemberList({
  group,
  onChange,
}: {
  group: Group;
  onChange: (g: Group) => void;
}) {
  const { t } = useI18n(group.lang);
  const [name, setName] = useState('');
  const activeMembers = useMemo(() => group.members.filter(m => m.isActive), [group.members]);
  const inactiveMembers = useMemo(() => group.members.filter(m => !m.isActive), [group.members]);

  function addMember() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const member: Member = {
      id: crypto.randomUUID(),
      name: trimmed,
      addedAt: new Date().toISOString(),
      isActive: true,
    };
    onChange({ ...group, members: [...group.members, member] });
    setName('');
  }

  function removeMember(id: string) {
    onChange({ ...group, members: group.members.map(m => (m.id === id ? { ...m, isActive: false } : m)) });
  }

  function restoreMember(id: string) {
    onChange({ ...group, members: group.members.map(m => (m.id === id ? { ...m, isActive: true } : m)) });
  }

  return (
    <section className="card">
      <h2>{t('members.title')}</h2>
      <div className="row">
        <input
          className="input"
          placeholder={t('members.addPlaceholder')}
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addMember()}
        />
        <button className="btn" onClick={addMember}>{t('members.add')}</button>
      </div>

      {activeMembers.length === 0 ? (
        <p className="muted">—</p>
      ) : (
        <ul className="chips">
          {activeMembers.map(m => (
            <li key={m.id} className="chip">
              <span>{m.name}</span>
              <button className="link danger" onClick={() => removeMember(m.id)} title={t('members.remove')}>
                {t('members.remove')}
              </button>
            </li>
          ))}
        </ul>
      )}

      {inactiveMembers.length > 0 && (
        <>
          <h3 className="subtitle">{t('members.removed')}</h3>
          <ul className="chips">
            {inactiveMembers.map(m => (
              <li key={m.id} className="chip">
                <span>{m.name}</span>
                <button className="link" onClick={() => restoreMember(m.id)} title={t('members.restore')}>
                  {t('members.restore')}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}