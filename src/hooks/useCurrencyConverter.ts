import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type { Currency, Language, LatestRatesResponse, Theme } from '../types';
import { formatAmount, getCurrencyName, getDefaultCurrencies, normalizeCode, parseAmount } from '../utils/currency';
import { translate } from '../utils/i18n';
import { loadSettings, saveSettings } from '../utils/storage';

const API_URL = 'https://api.currencyfreaks.com/v2.0/rates/latest';

export function useCurrencyConverter() {
  const initialSettings = useMemo(loadSettings, []);
  const [apiKey, setApiKey] = useState(initialSettings.apiKey);
  const [currencies, setCurrencies] = useState<Currency[]>(initialSettings.currencies);
  const [rates, setRates] = useState<Record<string, number>>(initialSettings.rates);
  const [ratesDate, setRatesDate] = useState(initialSettings.ratesDate);
  const [activeCode, setActiveCode] = useState(initialSettings.activeCode);
  const [activeAmount, setActiveAmount] = useState(initialSettings.activeAmount);
  const [theme, setTheme] = useState<Theme>(initialSettings.theme);
  const [language, setLanguage] = useState<Language>(initialSettings.language);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const t = useCallback((key: string) => translate(language, key), [language]);
  const selectedCodes = useMemo(() => currencies.map((currency) => currency.code), [currencies]);

  const displayCurrencies = useMemo(
    () => currencies.map((currency) => ({
      ...currency,
      name: getCurrencyName(currency.code, currency.name, language),
    })),
    [currencies, language],
  );

  const convertedValues = useMemo(() => {
    const amount = parseAmount(activeAmount);
    const activeRate = rates[activeCode];
    if (amount === undefined || !activeRate) return new Map<string, string>([[activeCode, activeAmount]]);

    const amountInUsd = amount / activeRate;
    return new Map(
      currencies.map((currency) => {
        if (currency.code === activeCode) return [currency.code, activeAmount];
        const rate = rates[currency.code];
        return [currency.code, rate ? formatAmount(amountInUsd * rate, language) : '—'];
      }),
    );
  }, [activeAmount, activeCode, currencies, language, rates]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    saveSettings({ apiKey, currencies, rates, ratesDate, activeCode, activeAmount, theme, language });
  }, [activeAmount, activeCode, apiKey, currencies, language, rates, ratesDate, theme]);

  const updateRates = useCallback(async () => {
    if (!apiKey.trim()) {
      setError(t('missingApiKey'));
      setSettingsOpen(true);
      return;
    }

    setIsUpdating(true);
    setError('');

    try {
      const symbols = Array.from(new Set(['USD', ...selectedCodes])).join(',');
      const url = new URL(API_URL);
      url.searchParams.set('apikey', apiKey.trim());
      url.searchParams.set('symbols', symbols);

      const response = await fetch(url);
      const payload = (await response.json()) as LatestRatesResponse | { message?: string; error?: string };

      if (!response.ok || !('rates' in payload)) {
        throw new Error(('message' in payload && payload.message) || ('error' in payload && payload.error) || t('fetchError'));
      }

      const nextRates: Record<string, number> = { USD: 1 };
      for (const [code, rawRate] of Object.entries(payload.rates)) {
        const rate = Number(rawRate);
        if (Number.isFinite(rate) && rate > 0) nextRates[normalizeCode(code)] = rate;
      }

      setRates(nextRates);
      setRatesDate(payload.date);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t('updateError'));
    } finally {
      setIsUpdating(false);
    }
  }, [apiKey, selectedCodes, t]);

  useEffect(() => {
    if (apiKey && !ratesDate) void updateRates();
  }, [apiKey, ratesDate, updateRates]);

  const addCurrency = (event: FormEvent) => {
    event.preventDefault();
    const code = normalizeCode(newCode);
    if (!code) return;
    if (currencies.some((currency) => currency.code === code)) {
      setError(`${code} ${t('alreadyAdded')}`);
      return;
    }

    setCurrencies((current) => [...current, { code, name: newName.trim() || getCurrencyName(code, code, language) }]);
    setNewCode('');
    setNewName('');
    setError('');
  };

  const removeCurrency = (code: string) => {
    if (currencies.length === 1) return;
    const nextCurrencies = currencies.filter((currency) => currency.code !== code);
    setCurrencies(nextCurrencies);
    if (activeCode === code) {
      setActiveCode(nextCurrencies[0]?.code ?? 'USD');
      setActiveAmount('1');
    }
  };

  const resetCurrencies = () => {
    setCurrencies(getDefaultCurrencies(language));
    setActiveCode('USD');
    setActiveAmount('1');
    setError('');
  };

  const changeLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    setCurrencies((current) => current.map((currency) => ({
      ...currency,
      name: getCurrencyName(currency.code, currency.name, nextLanguage),
    })));
  };

  return {
    activeCode,
    apiKey,
    convertedValues,
    displayCurrencies,
    error,
    isUpdating,
    language,
    newCode,
    newName,
    rates,
    ratesDate,
    settingsOpen,
    theme,
    t,
    addCurrency,
    changeLanguage,
    normalizeCode,
    removeCurrency,
    resetCurrencies,
    setActiveAmount,
    setActiveCode,
    setApiKey,
    setNewCode,
    setNewName,
    setSettingsOpen,
    setTheme,
    updateRates,
  };
}
