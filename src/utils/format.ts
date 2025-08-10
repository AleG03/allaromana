import type { Lang } from '@/core/types';

export function formatMoney(n: number, lang: Lang): string {
  const locale = lang === 'it' ? 'it-IT' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(n || 0);
}

export function formatDateISOToHuman(iso: string, lang: Lang): string {
  const locale = lang === 'it' ? 'it-IT' : 'en-US';
  try {
    return new Date(iso).toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}