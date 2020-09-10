import i18n from 'i18n-js';
import { round } from 'lodash';

// distance in meters
export const formatDistance = (distance: number) => {
  if (distance < 1000) return `${distance}m`;
  return `${round(distance / 1000, 2)}km`;
};

export const formatDuration = (duration: number) => {
  return `${round(duration / 60, 0)} min`;
};

export const getMonthName = (month: number) =>
  i18n.strftime(new Date(`2020-${padWithZero(month)}-01`), '%B');

export const formatCurrency = (value: number) => i18n.toCurrency(value);

export const padWithZero = (value: number) => (value < 10 ? `0${value}` : `${value}`);

export const hhMMFromDate = (date: Date) => {
  if (!date) return null;

  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${padWithZero(hours)}:${padWithZero(minutes)}`;
};
