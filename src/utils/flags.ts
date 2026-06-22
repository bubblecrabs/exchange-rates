const FLAG_CDN = 'https://flagcdn.com/24x18';
const FALLBACK_FLAG = `${FLAG_CDN}/un.png`;

export function getCurrencyFlag(code: string) {
  const upper = code.toUpperCase();
  const countryCode = upper.slice(0, 2).toLowerCase();

  if (countryCode.length === 2 && /^[a-z]{2}$/.test(countryCode)) {
    return `${FLAG_CDN}/${countryCode}.png`;
  }

  return FALLBACK_FLAG;
}
