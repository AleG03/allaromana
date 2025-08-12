import type { Lang } from '@/core/types';

export function formatDate(dateString: string, lang: Lang = 'it'): string {
  const date = new Date(dateString);
  
  // Use Italian format (DD/MM/YYYY) for both languages since it's more intuitive
  return date.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function formatDateShort(dateString: string, lang: Lang = 'it'): string {
  const date = new Date(dateString);
  const now = new Date();
  
  // Check if it's today
  if (date.toDateString() === now.toDateString()) {
    return lang === 'it' ? 'Oggi' : 'Today';
  }
  
  // Check if it's yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return lang === 'it' ? 'Ieri' : 'Yesterday';
  }
  
  // Check if it's this year
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit'
    });
  }
  
  // Full date for older dates
  return formatDate(dateString, lang);
}

export function getCurrentDateForInput(): string {
  // Returns YYYY-MM-DD format for HTML date inputs
  return new Date().toISOString().split('T')[0];
}

export function formatDateForInput(dateString: string): string {
  // Converts any date to YYYY-MM-DD format for HTML date inputs
  return new Date(dateString).toISOString().split('T')[0];
}