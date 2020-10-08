import i18n, { ToCurrencyOptions } from 'i18n-js';
import { round } from 'lodash';

// general

export const padWithZero = (value: number) => (value < 10 ? `0${value}` : `${value}`);
export const separateWithDot = (left: string, right: string) => `${left} \u25CF ${right}`;

// date & time

export const formatDate = (date: Date, pattern: 'default' | 'monthYear' = 'default') =>
  i18n.l(`date.formats.${pattern}`, date);
export const formatTime = (date: Date) => i18n.l('time.formats.default', date);
export const getMonthName = (month: number) =>
  i18n.strftime(new Date(`2020-${padWithZero(month)}-01`), '%B');

export const formatDuration = (duration: number) => {
  return `${round(duration / 60, 0)} min`;
};

// distance
export const formatDistance = (distance: number) => {
  if (distance < 1000) return `${distance}m`;
  return `${round(distance / 1000, 2)}km`;
};

// money and %

export const formatCurrency = (value: number, options?: ToCurrencyOptions) =>
  i18n.toCurrency(value / 100, options);
export const formatPct = (value: number) => `${parseFloat((value * 100).toFixed(2))}%`;
