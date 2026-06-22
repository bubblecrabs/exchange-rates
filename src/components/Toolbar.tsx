import type { Language } from '../types';
import { formatRatesDate } from '../utils/date';

type ToolbarProps = {
  isUpdating: boolean;
  language: Language;
  ratesDate: string;
  t: (key: string) => string;
  updateRates: () => void;
};

export function Toolbar({ isUpdating, language, ratesDate, t, updateRates }: ToolbarProps) {
  return (
    <section className="toolbar">
      <button type="button" onClick={updateRates} disabled={isUpdating}>{isUpdating ? t('updating') : t('update')}</button>
      <div className="status">{ratesDate ? `${t('rates')}: ${formatRatesDate(ratesDate, language)}` : t('ratesNotLoaded')}</div>
    </section>
  );
}
