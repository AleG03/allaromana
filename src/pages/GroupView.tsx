import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { computeBalances } from '@/core/calc';
import MemberList from '@/components/MemberList';
import ExpenseList from '@/components/ExpenseList';
import BalanceSummary from '@/components/BalanceSummary';
import CopyLinkButton from '@/components/CopyLinkButton';
import DeleteGroupButton from '@/components/DeleteGroupButton';
import SettlementList from '@/components/SettlementList';
import type { Group, Lang } from '@/core/types';
import { fetchRemoteGroup, saveRemoteGroup } from '@/core/remote';
import { useI18n } from '@/core/i18n';
import { addRecentGroup } from '@/utils/recentGroups';

export default function GroupView() {
  const { groupId = '' } = useParams();
  const browserLang: Lang = (navigator.language || '').toLowerCase().startsWith('it') ? 'it' : 'en';
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const remote = await fetchRemoteGroup(groupId);
        if (!canceled) {
          if (remote) {
            const withBalances = { ...remote, balances: computeBalances(remote) } as Group;
            (withBalances as any).lang = (withBalances as any).lang ?? 'it';
            if (!withBalances.settlements) withBalances.settlements = [];
            setGroup(withBalances);
            // Add to recent groups
            addRecentGroup(withBalances);
          } else {
            setGroup(null);
          }
        }
      } catch (e: any) {
        if (!canceled) {
          setError(e?.message || 'Failed to load group');
          setGroup(null);
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    })();
    return () => { canceled = true; };
  }, [groupId]);

  const pageLang: Lang = (group?.lang as Lang) || browserLang;
  const { t } = useI18n(pageLang);

  useEffect(() => {
    document.title = group?.name ? `${t('app.title')} · ${group.name}` : t('app.title');
  }, [group?.name, pageLang]);

  async function onGroupChange(updated: Group) {
    const toSave: Group = {
      ...updated,
      balances: computeBalances(updated),
      updatedAt: new Date().toISOString(),
      version: (updated.version || 1) + 1,
    };
    setGroup({ ...toSave });
    try { await saveRemoteGroup(toSave); } catch (e: any) { alert(`Failed to save changes: ${e.message || e}`); }
  }

  if (loading) return <div className="container"><p className="muted">{t('group.loading')}</p></div>;
  if (error) {
    return (
      <div className="container">
        <h2>Couldn’t load this group</h2>
        <p className="muted">{error}</p>
        <div className="row">
          <button className="btn" onClick={() => location.reload()}>{t('ui.retry')}</button>
          <Link to="/" className="btn">{t('ui.goHome')}</Link>
        </div>
      </div>
    );
  }
  if (!group) {
    return (
      <div className="container">
        <h2>{t('group.notFound')}</h2>
        <p className="muted">{t('group.notFound.desc')}</p>
        <Link to="/" className="btn">{t('ui.goHome')}</Link>
      </div>
    );
  }

  function setLang(newLang: Lang) {
    onGroupChange({ ...(group as Group), lang: newLang });
  }

  return (
    <div className="container">
      <header className="header">
        <div>
          <Link to="/" className="link" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1>{t('app.brand')}</h1>
          </Link>
          <p className="muted">{group.name}</p>
        </div>
        <div className="row" style={{ gap: 12 }}>
          <div className="segmented" role="tablist" aria-label="Language">
            <button className={group.lang === 'it' ? 'active' : ''} aria-pressed={group.lang === 'it'} onClick={() => setLang('it')}>IT</button>
            <button className={group.lang === 'en' ? 'active' : ''} aria-pressed={group.lang === 'en'} onClick={() => setLang('en')}>EN</button>
          </div>
          <CopyLinkButton lang={group.lang} />
          <DeleteGroupButton groupId={group.id} lang={group.lang} />
          <Link to={`/group/${group.id}/add`} className="btn primary">{t('group.addExpense')}</Link>
        </div>
      </header>

      <MemberList group={group} onChange={onGroupChange} />
      <ExpenseList group={group} onChange={onGroupChange} />
      <SettlementList group={group} onChange={onGroupChange} />
      <BalanceSummary group={group} balances={group.balances} />
    </div>
  );
}