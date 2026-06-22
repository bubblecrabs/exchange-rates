import { useState } from 'react';
import type { Currency } from '../types';
import { getCurrencyFlag } from '../utils/flags';

type CurrencyListProps = {
  activeCode: string;
  convertedValues: Map<string, string>;
  currencies: Currency[];
  rates: Record<string, number>;
  t: (key: string) => string;
  removeCurrency: (code: string) => void;
  setActiveAmount: (value: string) => void;
  setActiveCode: (code: string) => void;
};

export function CurrencyList(props: CurrencyListProps) {
  const { activeCode, convertedValues, currencies, rates, t, removeCurrency, setActiveAmount, setActiveCode } = props;
  const [pendingRemove, setPendingRemove] = useState<Currency | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleRemoveClick = (currency: Currency) => {
    if (currencies.length === 1) return;
    setPendingRemove(currency);
  };

  const handleConfirmRemove = () => {
    if (pendingRemove) {
      removeCurrency(pendingRemove.code);
      setPendingRemove(null);
    }
  };

  const handleCancelRemove = () => {
    setPendingRemove(null);
  };

  const handleCopy = (code: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  return (
    <section className="currency-list" aria-label={t('currencyList')}>
      {currencies.map((currency) => {
        const missingRate = currency.code !== 'USD' && !rates[currency.code];

        return (
          <article className={`currency-card ${currency.code === activeCode ? 'active' : ''}`} key={currency.code}>
            <div className="currency-identity">
              <img className="currency-flag" src={getCurrencyFlag(currency.code)} alt="" aria-hidden="true" />
              <div className="currency-meta" title={currency.name}>
                <strong>{currency.code}</strong>
                <span>{currency.name}</span>
              </div>
            </div>
            <input
              inputMode="decimal"
              value={convertedValues.get(currency.code) ?? ''}
              onChange={(event) => {
                setActiveCode(currency.code);
                setActiveAmount(event.target.value);
              }}
              onFocus={() => setActiveCode(currency.code)}
              placeholder={missingRate ? t('noRate') : '0'}
            />
            <button
              className={`copy${copiedCode === currency.code ? ' copied' : ''}`}
              type="button"
              onClick={() => handleCopy(currency.code, convertedValues.get(currency.code) ?? '')}
              aria-label={t('copy')}
            >
              {copiedCode === currency.code ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 6l2.5 3L10 3" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4.5" y="4.5" width="8" height="8" rx="1.5" />
                  <rect x="1.5" y="1.5" width="8" height="8" rx="1.5" />
                </svg>
              )}
            </button>
            <button className="remove" type="button" onClick={() => handleRemoveClick(currency)} aria-label={`${t('remove')} ${currency.code}`}>×</button>
            {missingRate && <small>{t('updateRateFor')} {currency.code}</small>}
          </article>
        );
      })}

      {pendingRemove && (
        <div className="confirm-overlay" onClick={handleCancelRemove}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>{t('confirmRemoveTitle')}</h3>
            <p>
              {t('confirmRemoveText')} <strong>{pendingRemove.code}</strong>
              {pendingRemove.name !== pendingRemove.code && <> ({pendingRemove.name})</>}?
            </p>
            <div className="confirm-actions">
              <button className="secondary" type="button" onClick={handleCancelRemove}>{t('cancel')}</button>
              <button className="danger" type="button" onClick={handleConfirmRemove}>{t('delete')}</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
