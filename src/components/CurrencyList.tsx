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
            <button className="remove" type="button" onClick={() => removeCurrency(currency.code)} aria-label={`${t('remove')} ${currency.code}`}>×</button>
            {missingRate && <small>{t('updateRateFor')} {currency.code}</small>}
          </article>
        );
      })}
    </section>
  );
}
