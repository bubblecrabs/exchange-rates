import type { FormEvent } from 'react';
import type { Language, Theme } from '../types';

type SettingsPanelProps = {
  apiKey: string;
  language: Language;
  newCode: string;
  newName: string;
  theme: Theme;
  t: (key: string) => string;
  addCurrency: (event: FormEvent) => void;
  changeLanguage: (language: Language) => void;
  normalizeCode: (value: string) => string;
  resetCurrencies: () => void;
  setApiKey: (value: string) => void;
  setNewCode: (value: string) => void;
  setNewName: (value: string) => void;
  setTheme: (theme: Theme) => void;
};

export function SettingsPanel(props: SettingsPanelProps) {
  const {
    apiKey,
    language,
    newCode,
    newName,
    theme,
    t,
    addCurrency,
    changeLanguage,
    normalizeCode,
    resetCurrencies,
    setApiKey,
    setNewCode,
    setNewName,
    setTheme,
  } = props;

  return (
    <section className="panel settings-panel">
      <div className="settings-row">
        <label>
          <span>{t('theme')}</span>
          <select value={theme} onChange={(event) => setTheme(event.target.value as Theme)}>
            <option value="light">{t('light')}</option>
            <option value="dark">{t('dark')}</option>
          </select>
        </label>
        <label>
          <span>{t('language')}</span>
          <select value={language} onChange={(event) => changeLanguage(event.target.value as Language)}>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </label>
      </div>

      <label>
        <span>{t('apiKey')}</span>
        <input value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder="YOUR_APIKEY" autoComplete="off" maxLength={128} />
      </label>
      <p className="hint">{t('apiHint')}</p>

      <form className="add-currency" onSubmit={addCurrency}>
        <input value={newCode} onChange={(event) => setNewCode(normalizeCode(event.target.value))} placeholder={t('codePlaceholder')} />
        <input value={newName} onChange={(event) => setNewName(event.target.value)} placeholder={t('namePlaceholder')} />
        <button type="submit">{t('add')}</button>
      </form>
      <button className="secondary full" type="button" onClick={resetCurrencies}>{t('reset')}</button>
    </section>
  );
}
