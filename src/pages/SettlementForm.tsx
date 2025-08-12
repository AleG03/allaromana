import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchRemoteGroup, saveRemoteGroup } from '@/core/remote';
import { computeBalances } from '@/core/calc';
import { useI18n } from '@/core/i18n';
import { getCurrentDateForInput } from '@/utils/dateFormat';
import type { Group, SettlementRecord, Lang } from '@/core/types';

export default function SettlementForm() {
  const { groupId = '' } = useParams();
  const navigate = useNavigate();
  const browserLang: Lang = (navigator.language || '').toLowerCase().startsWith('it') ? 'it' : 'en';
  
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getCurrentDateForInput());
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const remote = await fetchRemoteGroup(groupId);
        if (!canceled && remote) {
          const withBalances = { ...remote, balances: computeBalances(remote) } as Group;
          (withBalances as any).lang = (withBalances as any).lang ?? 'it';
          if (!withBalances.settlements) withBalances.settlements = [];
          setGroup(withBalances);
        }
      } catch (e: any) {
        if (!canceled) {
          alert(`Failed to load group: ${e.message || e}`);
          navigate('/');
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    })();
    return () => { canceled = true; };
  }, [groupId, navigate]);

  const pageLang: Lang = (group?.lang as Lang) || browserLang;
  const { t } = useI18n(pageLang);

  useEffect(() => {
    document.title = group?.name ? `${t('settlements.addTitle')} · ${group.name}` : t('app.title');
  }, [group?.name, pageLang]);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    
    if (!from) newErrors.from = t('validation.paidBy');
    if (!to) newErrors.to = t('validation.paidBy');
    if (from === to) newErrors.to = t('settlements.cannotSelfSettle');
    
    const amountNum = parseFloat(amount.replace(',', '.'));
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = t('validation.amount');
    }
    
    if (!date) newErrors.date = t('validation.date');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate() || !group) return;
    
    try {
      setSaving(true);
      
      const settlement: SettlementRecord = {
        id: crypto.randomUUID(),
        from,
        to,
        amount: parseFloat(amount.replace(',', '.')),
        date,
        createdAt: new Date().toISOString(),
      };

      console.log('Creating settlement:', settlement);

      const updated: Group = {
        ...group,
        settlements: [...(group.settlements || []), settlement],
        updatedAt: new Date().toISOString(),
        version: (group.version || 1) + 1,
      };
      
      // Compute balances with the new settlement included
      updated.balances = computeBalances(updated);

      console.log('Updated group with settlements:', updated.settlements);
      console.log('New balances:', updated.balances);

      await saveRemoteGroup(updated);
      navigate(`/group/${groupId}`);
    } catch (e: any) {
      console.error('Settlement save error:', e);
      alert(`Failed to save settlement: ${e.message || e}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="container"><p className="muted">{t('group.loading')}</p></div>;
  if (!group) return <div className="container"><p>Group not found</p></div>;

  const activeMembers = group.members.filter(m => m.isActive);

  return (
    <div className="container">
      <header className="header">
        <div>
          <Link to={`/group/${groupId}`} className="link">
            ← {group.name}
          </Link>
          <h1>{t('settlements.addTitle')}</h1>
        </div>
      </header>

      <div className="card">
        <div className="form-row">
          <label>{t('settlements.from')}</label>
          <select 
            className="input" 
            value={from} 
            onChange={e => setFrom(e.target.value)}
          >
            <option value="">{t('form.paidBy')}</option>
            {activeMembers.map(member => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
          {errors.from && <div className="error">{errors.from}</div>}
        </div>

        <div className="form-row">
          <label>{t('settlements.to')}</label>
          <select 
            className="input" 
            value={to} 
            onChange={e => setTo(e.target.value)}
          >
            <option value="">{t('settlements.to')}</option>
            {activeMembers.map(member => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
          {errors.to && <div className="error">{errors.to}</div>}
        </div>

        <div className="form-row">
          <label>{t('settlements.amount')}</label>
          <input
            className="input"
            type="text"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          {errors.amount && <div className="error">{errors.amount}</div>}
        </div>

        <div className="form-row">
          <label>{t('settlements.date')}</label>
          <input
            className="input"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
          {errors.date && <div className="error">{errors.date}</div>}
        </div>

        <div className="row">
          <Link to={`/group/${groupId}`} className="btn">
            {t('form.cancel')}
          </Link>
          <button 
            className="btn primary" 
            onClick={handleSubmit}
            disabled={saving}
          >
            {t('settlements.record')}
          </button>
        </div>
      </div>
    </div>
  );
}