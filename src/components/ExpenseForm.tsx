import { useMemo, useState } from 'react';
import type { Expense, Group } from '@/core/types';
import { isNonEmpty, isValidAmount, isValidISODate } from '@/core/validation';
import { useI18n } from '@/core/i18n';

export default function ExpenseForm({
  group,
  initial,
  onSubmit,
  onCancel,
}: {
  group: Group;
  initial?: Expense | null;
  onSubmit: (exp: Expense) => void;
  onCancel: () => void;
}) {
  const { t } = useI18n(group.lang);
  const activeMembers = useMemo(() => group.members.filter(m => m.isActive), [group.members]);
  const inactiveMembersById = useMemo(
    () => new Map(group.members.filter(m => !m.isActive).map(m => [m.id, m])),
    [group.members]
  );

  const [description, setDescription] = useState(initial?.description ?? '');
  const [amountStr, setAmountStr] = useState(initial ? String(initial.amount) : '');
  const [date, setDate] = useState(initial?.date?.slice(0, 10) ?? new Date().toISOString().slice(0, 10));
  const [paidBy, setPaidBy] = useState(initial?.paidBy ?? (activeMembers[0]?.id || ''));
  const [participants, setParticipants] = useState<string[]>(initial?.participants ?? activeMembers.map(m => m.id));
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  function toggleParticipant(id: string) {
    setParticipants(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: { [k: string]: string } = {};
    if (!isNonEmpty(description, 200)) errs.description = t('validation.description');
    if (!isValidAmount(amountStr)) errs.amount = t('validation.amount');
    if (!paidBy) errs.paidBy = t('validation.paidBy');
    if (!isValidISODate(date)) errs.date = t('validation.date');
    if (participants.length === 0) errs.participants = t('validation.participants');
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const normalizedAmount = parseFloat(amountStr.replace(',', '.'));

    const exp: Expense = {
      id: initial?.id ?? crypto.randomUUID(),
      description: description.trim(),
      amount: normalizedAmount,
      paidBy,
      participants,
      date: new Date(date).toISOString(),
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    };
    onSubmit(exp);
  }

  const inactiveIncluded = (initial?.participants || []).filter(id => inactiveMembersById.has(id));
  const paidByInactive = paidBy && !activeMembers.find(m => m.id === paidBy);
  const paidByInactiveName = paidByInactive ? inactiveMembersById.get(paidBy)?.name || 'Unknown' : '';

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>{t('form.description')}</label>
        <input
          className="input"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder={t('form.description')}
        />
        {errors.description && <div className="error">{errors.description}</div>}
      </div>

      <div className="form-row">
        <label>{t('form.amount')}</label>
        <input
          className="input"
          value={amountStr}
          onChange={e => setAmountStr(e.target.value)}
          placeholder={group.lang === 'it' ? '0,00' : '0.00'}
          inputMode="decimal"
        />
        {errors.amount && <div className="error">{errors.amount}</div>}
      </div>

      <div className="form-row">
        <label>{t('form.date')}</label>
        <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
        {errors.date && <div className="error">{errors.date}</div>}
      </div>

      <div className="form-row">
        <label>{t('form.paidBy')}</label>
        <select className="input" value={paidBy} onChange={e => setPaidBy(e.target.value)}>
          {activeMembers.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
          {paidByInactive && (
            <option value={paidBy} disabled>
              {paidByInactiveName} (inactive)
            </option>
          )}
        </select>
        {errors.paidBy && <div className="error">{errors.paidBy}</div>}
      </div>

      <div className="form-row">
        <label>{t('form.participants')}</label>
        <div className="grid">
          {activeMembers.map(m => (
            <label key={m.id} className="checkbox">
              <input
                type="checkbox"
                checked={participants.includes(m.id)}
                onChange={() => toggleParticipant(m.id)}
              />
              <span>{m.name}</span>
            </label>
          ))}
        </div>
        {inactiveIncluded.length > 0 && (
          <div className="muted small">
            Also includes inactive: {inactiveIncluded.map(id => inactiveMembersById.get(id)?.name || id).join(', ')}
          </div>
        )}
        {errors.participants && <div className="error">{errors.participants}</div>}
      </div>

      <div className="row">
        <button type="button" className="btn" onClick={onCancel}>{t('form.cancel')}</button>
        <button type="submit" className="btn primary">{initial ? t('form.saveChanges') : t('form.addExpense')}</button>
      </div>
    </form>
  );
}