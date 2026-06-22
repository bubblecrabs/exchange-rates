export type Theme = 'light' | 'dark';
export type Language = 'ru' | 'en';

export type Currency = {
  code: string;
  name: string;
};

export type LatestRatesResponse = {
  date: string;
  base: string;
  rates: Record<string, string>;
};

export type Settings = {
  apiKey: string;
  currencies: Currency[];
  rates: Record<string, number>;
  ratesDate: string;
  activeCode: string;
  activeAmount: string;
  theme: Theme;
  language: Language;
};
