import en from './locales/en';
import tk from './locales/tk';
import ru from './locales/ru';

export type Locale = 'tk' | 'en' | 'ru';

export const LOCALES: Locale[] = ['tk', 'en', 'ru'];

export const LOCALE_NAMES: Record<Locale, string> = {
  tk: 'TK',
  en: 'EN',
  ru: 'RU',
};

export type Dict = Record<string, string>;

export const translations: Record<Locale, Dict> = { tk, en, ru };
