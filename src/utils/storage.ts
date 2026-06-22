import type { Language, Settings, Theme } from '../types';
import { getCurrencyName, getDefaultCurrencies, normalizeCode } from './currency';

export const STORAGE_KEY = 'currency-converter-settings-v1';

export const DEFAULT_SETTINGS: Settings = {
  apiKey: '',
  currencies: getDefaultCurrencies('ru'),
  rates: { USD: 1 },
  ratesDate: '',
  ratesTimestamp: 0,
  activeCode: 'USD',
  activeAmount: '1',
  theme: 'light',
  language: 'ru',
};

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}

function isLanguage(value: unknown): value is Language {
  return value === 'ru' || value === 'en';
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    const language = isLanguage(parsed.language) ? parsed.language : DEFAULT_SETTINGS.language;
    const theme = isTheme(parsed.theme) ? parsed.theme : DEFAULT_SETTINGS.theme;

    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      language,
      theme,
      currencies: Array.isArray(parsed.currencies) && parsed.currencies.length > 0
        ? parsed.currencies.map((currency) => {
            const code = normalizeCode(currency.code);
            return { code, name: getCurrencyName(code, currency.name, language) };
          }).filter((currency) => currency.code)
        : getDefaultCurrencies(language),
      rates: { USD: 1, ...(parsed.rates ?? {}) },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
