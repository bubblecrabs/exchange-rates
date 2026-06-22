import type { Language } from '../types';

export function formatRatesDate(value: string, language: Language) {
  if (!value) return '';

  const midnightMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})\s00:00:00\+00$/);
  if (midnightMatch) {
    const [, year, month, day] = midnightMatch;
    return language === 'ru' ? `${day}.${month}.${year}` : `${month}/${day}/${year}`;
  }

  const isoLike = value.replace(' ', 'T').replace(/([+-]\d{2})$/, '$1:00');
  const date = new Date(isoLike);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
