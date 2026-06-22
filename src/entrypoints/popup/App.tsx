import { CurrencyList } from '../../components/CurrencyList';
import { Header } from '../../components/Header';
import { SettingsPanel } from '../../components/SettingsPanel';
import { Toolbar } from '../../components/Toolbar';
import { useCurrencyConverter } from '../../hooks/useCurrencyConverter';

function App() {
  const converter = useCurrencyConverter();

  return (
    <main className="app-shell">
      <Header t={converter.t} onToggleSettings={() => converter.setSettingsOpen((value) => !value)} />

      {converter.settingsOpen && (
        <SettingsPanel
          apiKey={converter.apiKey}
          language={converter.language}
          newCode={converter.newCode}
          newName={converter.newName}
          theme={converter.theme}
          t={converter.t}
          addCurrency={converter.addCurrency}
          changeLanguage={converter.changeLanguage}
          normalizeCode={converter.normalizeCode}
          resetCurrencies={converter.resetCurrencies}
          setApiKey={converter.setApiKey}
          setNewCode={converter.setNewCode}
          setNewName={converter.setNewName}
          setTheme={converter.setTheme}
        />
      )}

      <Toolbar
        isUpdating={converter.isUpdating}
        language={converter.language}
        ratesDate={converter.ratesDate}
        t={converter.t}
        updateRates={converter.updateRates}
      />

      {converter.error && <div className="error">{converter.error}</div>}

      <CurrencyList
        activeCode={converter.activeCode}
        convertedValues={converter.convertedValues}
        currencies={converter.displayCurrencies}
        rates={converter.rates}
        t={converter.t}
        removeCurrency={converter.removeCurrency}
        setActiveAmount={converter.setActiveAmount}
        setActiveCode={converter.setActiveCode}
      />
    </main>
  );
}

export default App;
