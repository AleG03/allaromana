import type { Lang } from './types';

type Dict = Record<string, string>;

const it: Dict = {
  'app.title': 'AllaRomana',
  'app.brand': '🍝 AllaRomana',
  'app.tagline': 'Dividiamo alla romana. Semplice, veloce.',

  'home.createTitle': 'Crea un nuovo gruppo',
  'home.openTitle': 'Apri un gruppo esistente',
  'home.openDesc': 'Usa o condividi il link del gruppo per accedervi da qualsiasi dispositivo.',
  'home.namePlaceholder': 'Nome del gruppo',
  'home.create': 'Crea',
  'home.lang': 'Lingua',

  'group.shareGroup': 'Condividi gruppo',
  'group.addExpense': 'Aggiungi spesa',
  'group.loading': 'Caricamento…',
  'ui.loading': 'Caricamento…',
  'group.notFound': 'Gruppo non trovato',
  'group.notFound.desc': 'Il link potrebbe essere errato o il gruppo è stato rimosso.',

  'members.title': 'Persone',
  'members.addPlaceholder': 'Aggiungi persona (nome)',
  'members.add': 'Aggiungi',
  'members.remove': 'rimuovi',
  'members.restore': 'ripristina',
  'members.removed': 'Rimossi',

  'expenses.title': 'Spese',
  'expenses.none': 'Ancora nessuna spesa. Aggiungine una!',
  'expenses.edit': 'Modifica',
  'expenses.delete': 'Elimina',
  'expenses.addTitle': 'Aggiungi spesa',
  'expenses.editTitle': 'Modifica spesa',

  'confirm.deleteExpense': 'Eliminare questa spesa?',

  'form.description': 'Descrizione',
  'form.amount': 'Importo',
  'form.date': 'Data',
  'form.paidBy': 'Pagato da',
  'form.participants': 'Partecipanti',
  'form.cancel': 'Annulla',
  'form.addExpense': 'Aggiungi spesa',
  'form.saveChanges': 'Salva modifiche',

  'validation.description': 'Inserisci una descrizione (max 200 caratteri).',
  'validation.amount': 'Inserisci un importo valido (es. 12,34 o 12.34).',
  'validation.paidBy': 'Seleziona chi ha pagato.',
  'validation.date': 'Inserisci una data valida (AAAA-MM-GG).',
  'validation.participants': 'Seleziona almeno un partecipante.',

  'summary.title': 'Riepilogo',
  'summary.netBalances': 'Saldo',
  'summary.suggested': 'Pagamenti suggeriti',
  'summary.none': 'Nessun pagamento necessario.',
  'summary.settled': 'Siete in pari.',
  'summary.pays': '{from} paga {to} {amount}',

  'ui.retry': 'Riprova',
  'ui.goHome': 'Torna alla home',
  'ui.participantsCount': '{n} partecipanti',
  'ui.participantsSingle': '1 partecipante',

  'home.recentTitle': 'Gruppi recenti',
  'recent.today': 'oggi',
  'recent.yesterday': 'ieri',
  'recent.daysAgo': '{days} giorni fa',
  'recent.remove': 'Rimuovi dai recenti',

  'group.shareGroup.success': 'Link copiato!',
  'group.shareGroup.shareMessage': 'Condividi questo link per invitare altri al gruppo',
  'group.deleteGroup': 'Elimina gruppo',
  'group.deleteConfirm': 'Sei sicuro di voler eliminare questo gruppo? Questa azione non può essere annullata.',

  'settlements.title': 'Saldati',
  'settlements.none': 'Nessun saldo registrato.',
  'settlements.add': 'Registra saldo',
  'settlements.addTitle': 'Registra un saldo',
  'settlements.from': 'Da',
  'settlements.to': 'A',
  'settlements.amount': 'Importo',
  'settlements.date': 'Data',
  'settlements.record': 'Registra',
  'settlements.delete': 'Elimina',
  'settlements.settled': '{from} ha saldato {to} {amount}',
  'settlements.cannotSelfSettle': 'Non puoi saldare te stesso',

  'timeline.title': 'Cronologia',
  'timeline.noActivity': 'Nessuna attività. Aggiungi una spesa o registra un saldo!',
};

const en: Dict = {
  'app.title': 'AllaRomana',
  'app.brand': '🍝 AllaRomana',
  'app.tagline': 'Simple, no-nonsense group expense splitting.',

  'home.createTitle': 'Create a new group',
  'home.openTitle': 'Open an existing group',
  'home.openDesc': 'Use or share the group link to access it from any device.',
  'home.namePlaceholder': 'Group name',
  'home.create': 'Create',
  'home.lang': 'Language',

  'group.shareGroup': 'Share group',
  'group.addExpense': 'Add expense',
  'group.loading': 'Loading…',
  'ui.loading': 'Loading…',
  'group.notFound': 'Group not found',
  'group.notFound.desc': 'The link may be wrong or the group was removed.',

  'members.title': 'Members',
  'members.addPlaceholder': 'Add member (name)',
  'members.add': 'Add',
  'members.remove': 'remove',
  'members.restore': 'restore',
  'members.removed': 'Removed',

  'expenses.title': 'Expenses',
  'expenses.none': 'No expenses yet. Add one!',
  'expenses.edit': 'Edit',
  'expenses.delete': 'Delete',
  'expenses.addTitle': 'Add Expense',
  'expenses.editTitle': 'Edit Expense',

  'confirm.deleteExpense': 'Delete this expense?',

  'form.description': 'Description',
  'form.amount': 'Amount',
  'form.date': 'Date',
  'form.paidBy': 'Paid by',
  'form.participants': 'Participants',
  'form.cancel': 'Cancel',
  'form.addExpense': 'Add expense',
  'form.saveChanges': 'Save changes',

  'validation.description': 'Enter a description (max 200 chars).',
  'validation.amount': 'Enter a valid amount (e.g., 12.34 or 12,34).',
  'validation.paidBy': 'Select who paid.',
  'validation.date': 'Enter a valid date (YYYY-MM-DD).',
  'validation.participants': 'Select at least one participant.',

  'summary.title': 'Summary',
  'summary.netBalances': 'Net balances',
  'summary.suggested': 'Suggested settlements',
  'summary.none': 'No payments needed.',
  'summary.settled': 'Everyone is settled up.',
  'summary.pays': '{from} pays {to} {amount}',

  'ui.retry': 'Retry',
  'ui.goHome': 'Go Home',
  'ui.participantsCount': '{n} participants',
  'ui.participantsSingle': '1 participant',

  'home.recentTitle': 'Recent groups',
  'recent.today': 'today',
  'recent.yesterday': 'yesterday',
  'recent.daysAgo': '{days} days ago',
  'recent.remove': 'Remove from recent',

  'group.shareGroup.success': 'Link copied!',
  'group.shareGroup.shareMessage': 'Share this link to invite others to the group',
  'group.deleteGroup': 'Delete group',
  'group.deleteConfirm': 'Are you sure you want to delete this group? This action cannot be undone.',

  'settlements.title': 'Settled',
  'settlements.none': 'No settlements recorded.',
  'settlements.add': 'Record settlement',
  'settlements.addTitle': 'Record a settlement',
  'settlements.from': 'From',
  'settlements.to': 'To',
  'settlements.amount': 'Amount',
  'settlements.date': 'Date',
  'settlements.record': 'Record',
  'settlements.delete': 'Delete',
  'settlements.settled': '{from} settled {to} {amount}',
  'settlements.cannotSelfSettle': 'Cannot settle to yourself',

  'timeline.title': 'Timeline',
  'timeline.noActivity': 'No activity yet. Add an expense or record a settlement!',
};

const dict: Record<Lang, Dict> = { it, en };

export function t(lang: Lang, key: string, params?: Record<string, string | number>) {
  const table = dict[lang] ?? dict.en;
  let s = table[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return s;
}

export function useI18n(lang: Lang) {
  return {
    lang,
    t: (key: string, params?: Record<string, string | number>) => t(lang, key, params),
  };
}
