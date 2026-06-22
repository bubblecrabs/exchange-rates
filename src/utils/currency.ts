import { translate } from './i18n';
import type { Currency, Language } from '../types';

export const DEFAULT_CODES = ['USD', 'EUR', 'UAH', 'PLN', 'CZK', 'KZT', 'BYN'];

export const CODE_NAME_KEYS: Record<string, string> = {
  USD: 'usd',
  EUR: 'eur',
  UAH: 'uah',
  PLN: 'pln',
  CZK: 'czk',
  KZT: 'kzt',
  BYN: 'byn',
};

export function getDefaultCurrencies(language: Language): Currency[] {
  return DEFAULT_CODES.map((code) => ({ code, name: translate(language, CODE_NAME_KEYS[code]) }));
}

export function normalizeCode(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
}

export function parseAmount(value: string) {
  const normalized = value.replace(',', '.').trim();
  if (normalized === '' || normalized === '-' || normalized === '.') return undefined;
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : undefined;
}

export function formatAmount(value: number, language: Language) {
  if (!Number.isFinite(value)) return '';

  return new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : 'en-US', {
    maximumFractionDigits: Math.abs(value) >= 100 ? 2 : 6,
    minimumFractionDigits: 0,
  }).format(value);
}

export function getCurrencyName(code: string, savedName: string, language: Language) {
  const nameKey = CODE_NAME_KEYS[code];
  if (!nameKey) return savedName || code;

  const localizedName = translate(language, nameKey);
  const knownNames = [translate('ru', nameKey), translate('en', nameKey), code];
  return knownNames.includes(savedName) ? localizedName : savedName;
}
