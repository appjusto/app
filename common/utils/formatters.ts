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

const dateInput = (value: Date | firebase.firestore.FieldValue) =>
  value.constructor.name === 'Date'
    ? (value as Date)
    : (value as firebase.firestore.Timestamp).toDate();

// date & time
export const formatDate = (
  date: Date | firebase.firestore.FieldValue,
  pattern: 'default' | 'monthYear' = 'default'
) => i18n.l(`date.formats.${pattern}`, dateInput(date));

export const formatTime = (date: Date | firebase.firestore.FieldValue) =>
  i18n.l('time.formats.default', dateInput(date));
export const getMonthName = (month: number) => i18n.strftime(new Date(2020, month, 1), '%B');

export const formatDuration = (duration: number) => {
  return `${round(duration / 60, 0)} min`;
};

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
