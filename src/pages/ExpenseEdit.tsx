import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import ExpenseForm from '@/components/ExpenseForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { Group, Expense } from '@/core/types';
import { fetchRemoteGroup, saveRemoteGroup } from '@/core/remote';
import { computeBalances } from '@/core/calc';
import { useI18n } from '@/core/i18n';

export default function ExpenseEdit() {
  const { groupId = '', expenseId = '' } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    fetchRemoteGroup(groupId).then(g => setGroup(g));
  }, [groupId]);

  const expense = useMemo(
    () => group?.expenses.find(e => e.id === expenseId) || null,
    [group, expenseId]
  );

  if (!group || !expense) {
    return (
      <div className="container">
        <div className="card">
          <LoadingSpinner size="medium" />
        </div>
      </div>
    );
  }

  const { t } = useI18n(group.lang);

  async function onSubmit(updatedExpense: Expense) {
    if (!group) return;
    const g: Group = group;

    const updated: Group = {
      ...g,
      expenses: g.expenses.map(e => (e.id === updatedExpense.id ? updatedExpense : e)),
      updatedAt: new Date().toISOString(),
      version: (g.version ?? 1) + 1,
    };
    const withBalances: Group = { ...updated, balances: computeBalances(updated) };

    try {
      await saveRemoteGroup(withBalances);
      navigate(`/group/${g.id}`);
    } catch (e: any) {
      alert(`Failed to save changes: ${e.message || e}`);
    }
  }

  return (
    <div className="container">
      <h2>{t('expenses.editTitle')}</h2>
      <ExpenseForm group={group} initial={expense} onSubmit={onSubmit} onCancel={() => navigate(-1)} />
    </div>
  );
}