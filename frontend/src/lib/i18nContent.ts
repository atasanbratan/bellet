import { LOCALES, type Locale } from '../i18n/translations';
import type { Province, Subject } from '../types';

type Suffix = 'Tk' | 'En' | 'Ru';

/** Values of one text field in the three content languages. */
export type LangValues = Record<Locale, string>;

export const emptyLangValues = (): LangValues => ({ tk: '', en: '', ru: '' });

/** Which languages have text — used to mark language tabs with a dot. */
export function filledLocales(...fields: LangValues[]): Set<Locale> {
  const set = new Set<Locale>();
  for (const f of fields) {
    for (const l of LOCALES) if (f[l].trim()) set.add(l);
  }
  return set;
}

/** Read per-language values from an API object; legacy text lands in the TK slot. */
export function toLangValues(
  obj: Record<string, unknown>,
  base: 'title' | 'description',
): LangValues {
  const get = (k: string) => {
    const v = obj[k];
    return typeof v === 'string' ? v : '';
  };
  const values = {
    tk: get(`${base}Tk`),
    en: get(`${base}En`),
    ru: get(`${base}Ru`),
  };
  if (!values.tk && !values.en && !values.ru) values.tk = get(base);
  return values;
}

/** Spread into an API payload: { titleTk, titleEn, titleRu }. */
export const langFields = (base: 'title' | 'description', v: LangValues) => ({
  [`${base}Tk`]: v.tk,
  [`${base}En`]: v.en,
  [`${base}Ru`]: v.ru,
});

const ORDER: Record<Locale, Suffix[]> = {
  tk: ['Tk', 'En', 'Ru'],
  en: ['En', 'Tk', 'Ru'],
  ru: ['Ru', 'Tk', 'En'],
};

interface I18nContent {
  title?: string | null;
  titleTk?: string | null;
  titleEn?: string | null;
  titleRu?: string | null;
  description?: string | null;
  descriptionTk?: string | null;
  descriptionEn?: string | null;
  descriptionRu?: string | null;
}

/**
 * Pick user-entered content in the viewer's language, falling back to any
 * available translation, then to the legacy single-language field.
 * e.g. locText(offering, 'title', 'ru') → titleRu ?? titleTk ?? titleEn ?? title
 */
export function locText(
  obj: I18nContent,
  base: 'title' | 'description',
  locale: Locale,
): string {
  const record = obj as Record<string, unknown>;
  for (const suffix of ORDER[locale]) {
    const v = record[`${base}${suffix}`];
    if (typeof v === 'string' && v.trim()) return v;
  }
  const fallback = record[base];
  return typeof fallback === 'string' ? fallback : '';
}

/** Seeded rows carry their own translations rather than i18n keys. */
type NamedRow = { nameTk: string; nameEn: string; nameRu: string };

const rowName = (row: NamedRow, locale: Locale) =>
  ({ tk: row.nameTk, en: row.nameEn, ru: row.nameRu })[locale];

/** A welayat/province's name in the viewer's language. */
export function provinceName(province: Province | undefined | null, locale: Locale) {
  return province ? rowName(province, locale) : '';
}

/** A subject's name in the viewer's language. */
export function subjectName(subject: Subject | undefined | null, locale: Locale) {
  return subject ? rowName(subject, locale) : '';
}
