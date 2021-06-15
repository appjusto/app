import { Address } from '@appjusto/types';
import i18n, { ToCurrencyOptions } from 'i18n-js';
import { round } from 'lodash';

// general

export const padWithZero = (value: number) => (value < 10 ? `0${value}` : `${value}`);
export const separateWithDot = (left: string, right: string) => `${left}  \u00B7  ${right}`;
export const removeAccents = (str: string) => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

// datetime
export { formatDate, formatDuration, formatHour, formatTime, getMonthName } from './datetime';

// distance
export const formatDistance = (distance: number) => {
  if (distance < 1000) return `${distance}m`;
  if (distance > 1000 * 10) return `${round(distance / 1000, 0)}km`;
  return `${round(distance / 1000, 1)}km`;
};

// money and %

export const formatCurrency = (value: number, options?: ToCurrencyOptions) =>
  i18n.toCurrency(value / 100, options);
export const formatPct = (value: number) => `${parseFloat((value * 100).toFixed(2))}%`;

// address

export const formatAddress = (address: Address) => `${address.main}`;
