import type { Balance, Group } from '@/core/types';
import { formatMoney } from '@/utils/format';
import { useI18n } from '@/core/i18n';

export default function BalanceSummary({
  group,
  balances,
}: {
  group: Group;
  balances: Balance[];
}) {
  const { t, lang } = useI18n(group.lang);
  const membersById = new Map(group.members.map(m => [m.id, m]));
  const anyNonZero = balances.some(b => Math.abs(b.netBalance) > 0.0001);

  const settlements = balances.flatMap(b => b.settlements);

  return (
    <section className="card">
      <h2>{t('summary.title')}</h2>

      {!anyNonZero ? (
        <p className="success">{t('summary.settled')}</p>
      ) : (
        <>
          <h3 className="subtitle">{t('summary.netBalances')}</h3>
          <ul className="list">
            {balances.map(b => (
              <li key={b.memberId} className="list-item">
                <div className="item-col">
                  <div className="item-title">{membersById.get(b.memberId)?.name || 'Unknown'}</div>
                </div>
                <div className="item-col right">
                  <div className={`item-amount ${b.netBalance >= 0 ? 'pos' : 'neg'}`}>
                    {formatMoney(b.netBalance, lang)}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <h3 className="subtitle">{t('summary.suggested')}</h3>
          <ul className="list">
            {settlements.length === 0 ? (
              <li className="list-item">{t('summary.none')}</li>
            ) : (
              settlements.map((s, idx) => (
                <li key={idx} className="list-item">
                  <div className="item-col">
                    <div className="item-title">
                      {t('summary.pays', {
                        from: membersById.get(s.from)?.name || 'Unknown',
                        to: membersById.get(s.to)?.name || 'Unknown',
                        amount: formatMoney(s.amount, lang),
                      })}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </section>
  );
}