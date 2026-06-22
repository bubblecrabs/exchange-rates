type HeaderProps = {
  t: (key: string) => string;
  onToggleSettings: () => void;
};

export function Header({ t, onToggleSettings }: HeaderProps) {
  return (
    <header className="hero">
      <div>
        <p className="eyebrow">CurrencyFreaks</p>
        <h1>{t('appTitle')}</h1>
        <p className="subtle">{t('subtitle')}</p>
      </div>
      <button className="icon-button" type="button" onClick={onToggleSettings} aria-label={t('settings')}>⚙</button>
    </header>
  );
}
