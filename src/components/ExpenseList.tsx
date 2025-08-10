import type { Group } from '@/core/types';
import { Link } from 'react-router-dom';
import { formatDateISOToHuman, formatMoney } from '@/utils/format';
import { useI18n } from '@/core/i18n';

export default function ExpenseList({
  group,
  onChange,
}: {
  group: Group;
  onChange: (g: Group) => void;
}) {
  const { t, lang } = useI18n(group.lang);
  const membersById = new Map(group.members.map(m => [m.id, m]));
  const expenses = [...group.expenses].sort((a, b) => b.date.localeCompare(a.date));

  function deleteExpense(id: string) {
    if (!confirm(t('confirm.deleteExpense'))) return;
    onChange({ ...group, expenses: group.expenses.filter(e => e.id !== id) });
  }

  return (
    <section className="card">
      <h2>{t('expenses.title')}</h2>
      {expenses.length === 0 ? (
        <p className="muted">{t('expenses.none')}</p>
      ) : (
        <ul className="list">
          {expenses.map(e => {
            const payer = membersById.get(e.paidBy)?.name || 'Unknown';
            return (
              <li key={e.id} className="list-item">
                <div className="item-col">
                  <div className="item-title">{e.description}</div>
                  <div className="item-sub">
                    {formatDateISOToHuman(e.date, lang)} • {t('form.paidBy')} {payer} • {e.participants.length === 1 ? t('ui.participantsSingle') : t('ui.participantsCount', { n: e.participants.length })}
                  </div>
                </div>
                <div className="item-col right">
                  <div className="item-amount">{formatMoney(e.amount, lang)}</div>
                  <div className="row">
                    <Link to={`/group/${group.id}/edit/${e.id}`} className="btn small">{t('expenses.edit')}</Link>
                    <button className="btn small danger" onClick={() => deleteExpense(e.id)}>{t('expenses.delete')}</button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}