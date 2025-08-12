import { Link } from 'react-router-dom';
import { useI18n } from '@/core/i18n';
import type { Group, SettlementRecord } from '@/core/types';

interface SettlementListProps {
  group: Group;
  onChange: (group: Group) => void;
}

export default function SettlementList({ group, onChange }: SettlementListProps) {
  const { t } = useI18n(group.lang);
  const settlements = group.settlements || [];

  function getMemberName(memberId: string): string {
    return group.members.find(m => m.id === memberId)?.name || 'Unknown';
  }

  function formatAmount(amount: number): string {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  function deleteSettlement(settlementId: string) {
    if (!confirm(t('confirm.deleteExpense'))) return;
    
    const updated = {
      ...group,
      settlements: settlements.filter(s => s.id !== settlementId),
    };
    onChange(updated);
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2>{t('settlements.title')}</h2>
        <Link to={`/group/${group.id}/settle`} className="btn small">
          {t('settlements.add')}
        </Link>
      </div>

      {settlements.length === 0 ? (
        <p className="muted">{t('settlements.none')}</p>
      ) : (
        <ul className="list">
          {settlements.map((settlement: SettlementRecord) => (
            <li key={settlement.id} className="list-item">
              <div className="item-col">
                <div className="item-title">
                  {t('settlements.settled', {
                    from: getMemberName(settlement.from),
                    to: getMemberName(settlement.to),
                    amount: formatAmount(settlement.amount)
                  })}
                </div>
                <div className="item-sub">
                  {formatDate(settlement.date)}
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
          ))}
        </ul>
      )}
    </div>
  );
}