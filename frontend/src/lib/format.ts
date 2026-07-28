export const money = (value: string | number): string =>
  `${Number(value).toLocaleString()} TMT`;
