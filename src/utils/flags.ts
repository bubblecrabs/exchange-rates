const FLAG_CDN = 'https://flagcdn.com/24x18';

const FLAG_SRC: Record<string, string> = {
  USD: `${FLAG_CDN}/us.png`,
  EUR: `${FLAG_CDN}/eu.png`,
  UAH: `${FLAG_CDN}/ua.png`,
  PLN: `${FLAG_CDN}/pl.png`,
  CZK: `${FLAG_CDN}/cz.png`,
  KZT: `${FLAG_CDN}/kz.png`,
  BYN: `${FLAG_CDN}/by.png`,
  GBP: `${FLAG_CDN}/gb.png`,
  CHF: `${FLAG_CDN}/ch.png`,
  CAD: `${FLAG_CDN}/ca.png`,
  AUD: `${FLAG_CDN}/au.png`,
  NZD: `${FLAG_CDN}/nz.png`,
  JPY: `${FLAG_CDN}/jp.png`,
  CNY: `${FLAG_CDN}/cn.png`,
  TRY: `${FLAG_CDN}/tr.png`,
};

const FALLBACK_FLAG = `${FLAG_CDN}/un.png`;

export function getCurrencyFlag(code: string) {
  return FLAG_SRC[code.toUpperCase()] ?? FALLBACK_FLAG;
}
