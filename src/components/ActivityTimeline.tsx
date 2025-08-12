import { Link } from 'react-router-dom';
import { useI18n } from '@/core/i18n';
import { formatDateShort } from '@/utils/dateFormat';
import { formatMoney } from '@/utils/format';
import type { Group, Expense, SettlementRecord } from '@/core/types';

interface TimelineItem {
  id: string;
  type: 'expense' | 'settlement';
  date: string;
  createdAt: string;
  data: Expense | SettlementRecord;
}

interface ActivityTimelineProps {
  group: Group;
  onChange: (group: Group) => void;
}

export default function ActivityTimeline({ group, onChange }: ActivityTimelineProps) {
  const { t } = useI18n(group.lang);
  const membersById = new Map(group.members.map(m => [m.id, m]));

  // Combine expenses and settlements into a unified timeline
  const timelineItems: TimelineItem[] = [
    ...group.expenses.map(expense => ({
      id: expense.id,
      type: 'expense' as const,
      date: expense.date,
      createdAt: expense.createdAt,
      data: expense
    })),
    ...(group.settlements || []).map(settlement => ({
      id: settlement.id,
      type: 'settlement' as const,
      date: settlement.date,
      createdAt: settlement.createdAt,
      data: settlement
    }))
  ].sort((a, b) => b.date.localeCompare(a.date));

  function getMemberName(memberId: string): string {
    return membersById.get(memberId)?.name || 'Unknown';
  }

  function formatAmount(amount: number): string {
    return formatMoney(amount, group.lang);
  }

  function deleteExpense(id: string) {
    if (!confirm(t('confirm.deleteExpense'))) return;
    onChange({ ...group, expenses: group.expenses.filter(e => e.id !== id) });
  }

  function deleteSettlement(settlementId: string) {
    if (!confirm(t('confirm.deleteExpense'))) return;
    const updated = {
      ...group,
      settlements: (group.settlements || []).filter(s => s.id !== settlementId),
    };
    onChange(updated);
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2>{t('timeline.title')}</h2>
        <div className="row" style={{ gap: 8 }}>
          <Link to={`/group/${group.id}/settle`} className="btn small">
            {t('settlements.add')}
          </Link>
          <Link to={`/group/${group.id}/add`} className="btn small primary">
            {t('group.addExpense')}
          </Link>
        </div>
      </div>

      {timelineItems.length === 0 ? (
        <p className="muted">{t('timeline.noActivity')}</p>
      ) : (
        <ul className="list">
          {timelineItems.map(item => {
            if (item.type === 'expense') {
              const expense = item.data as Expense;
              const payer = getMemberName(expense.paidBy);
              return (
                <li key={`expense-${item.id}`} className="list-item">
                  <div className="item-col">
                    <div className="item-title">
                      💰 {expense.description}
                    </div>
                    <div className="item-sub">
                      {formatDateShort(expense.date, group.lang)} • {t('form.paidBy')} {payer} • {expense.participants.length === 1 ? t('ui.participantsSingle') : t('ui.participantsCount', { n: expense.participants.length })}
                    </div>
                  </div>
                  <div className="item-col right">
                    <div className="item-amount">{formatAmount(expense.amount)}</div>
                    <div className="row">
                      <Link to={`/group/${group.id}/edit/${expense.id}`} className="btn small">{t('expenses.edit')}</Link>
                      <button className="btn small danger" onClick={() => deleteExpense(expense.id)}>{t('expenses.delete')}</button>
                    </div>
                  </div>
                </li>
              );
            } else {
              const settlement = item.data as SettlementRecord;
              return (
                <li key={`settlement-${item.id}`} className="list-item">
                  <div className="item-col">
                    <div className="item-title">
                      ✅ {t('settlements.settled', {
                        from: getMemberName(settlement.from),
                        to: getMemberName(settlement.to),
                        amount: formatAmount(settlement.amount)
                      })}
                    </div>
                    <div className="item-sub">
                      {formatDateShort(settlement.date, group.lang)}
                    </div>
                  </div>
                  <div className="item-col right">
                    <button
                      className="link danger small"
                      onClick={() => deleteSettlement(settlement.id)}
                    >
                      {t('settlements.delete')}
                    </button>
                  </div>
                </li>
              );
            }
          })}
        </ul>
      )}
    </div>
  );
}