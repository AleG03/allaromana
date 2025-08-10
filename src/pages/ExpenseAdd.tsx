import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ExpenseForm from '@/components/ExpenseForm';
import type { Group, Expense } from '@/core/types';
import { fetchRemoteGroup, saveRemoteGroup } from '@/core/remote';
import { computeBalances } from '@/core/calc';
import { useI18n } from '@/core/i18n';

export default function ExpenseAdd() {
  const { groupId = '' } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    fetchRemoteGroup(groupId).then(g => setGroup(g));
  }, [groupId]);

  if (!group) {
    return (
      <div className="container">
        <h2>Group not found</h2>
        <Link to="/" className="btn">Go Home</Link>
      </div>
    );
  }

  const { t } = useI18n(group.lang);

  async function onSubmit(expense: Expense) {
    if (!group) return;
    const g: Group = group;

    const updated: Group = {
      ...g,
      expenses: [expense, ...g.expenses],
      updatedAt: new Date().toISOString(),
      version: (g.version ?? 1) + 1,
    };
    const withBalances: Group = { ...updated, balances: computeBalances(updated) };

    try {
      await saveRemoteGroup(withBalances);
      navigate(`/group/${g.id}`);
    } catch (e: any) {
      alert(`Failed to save expense: ${e.message || e}`);
    }
  }

  return (
    <div className="container">
      <h2>{t('expenses.addTitle')}</h2>
      <ExpenseForm group={group} onSubmit={onSubmit} onCancel={() => navigate(-1)} />
    </div>
  );
}