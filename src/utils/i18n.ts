import enRaw from '../locales/en.yml?raw';
import ruRaw from '../locales/ru.yml?raw';
import type { Language } from '../types';

function parseFlatYaml(raw: string) {
  return Object.fromEntries(
    raw
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const separatorIndex = line.indexOf(':');
        if (separatorIndex === -1) return [line, ''];
        const key = line.slice(0, separatorIndex).trim();
        const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');
        return [key, value];
      }),
  ) as Record<string, string>;
}

export const dictionaries: Record<Language, Record<string, string>> = {
  ru: parseFlatYaml(ruRaw),
  en: parseFlatYaml(enRaw),
};

export function translate(language: Language, key: string) {
  return dictionaries[language][key] ?? dictionaries.ru[key] ?? key;
}
