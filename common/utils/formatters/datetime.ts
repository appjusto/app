import dayjs from 'dayjs';
import { FieldValue } from 'firebase/firestore';
import i18n from 'i18n-js';
import { round } from 'lodash';
import { dateInput } from './utils';

const weekDays = new Array(7)
  .fill(null)
  .map((v, i) => i18n.strftime(new Date(2024, 0, i + 1), '%A'));
export const getMonthName = (month: number) => i18n.strftime(new Date(2020, month, 1), '%B');
export const getWeekName = (index: number) => weekDays[index];

export const formatDate = (date: Date | FieldValue, pattern: 'default' | 'monthYear' = 'default') =>
  i18n.l(`date.formats.${pattern}`, dateInput(date));

export const formatTime = (date: Date | FieldValue, pattern: 'default' | 'raw' = 'default') =>
  i18n.l(`time.formats.${pattern}`, dateInput(date));

export const formatDuration = (duration: number) => {
  return `${round(duration / 60, 0)} min`;
};

export const getETAWithMargin = (date: Date | FieldValue, margin: number = 30) =>
  `${formatTime(date)} - ${formatTime(dayjs(dateInput(date)).add(margin, 'minute').toDate())}`;

export const formatHour = (value: string | undefined) => {
  let formatedNumber = '';
  if (value) {
    let hours = value.slice(0, 2);
    let minutes = value.slice(2, 4);
    if (parseInt(hours, 10) > 23) {
      hours = '00';
    }
    if (parseInt(minutes, 10) > 59) {
      minutes = '00';
    }
    if (minutes === '') {
      formatedNumber = `${hours}`;
    } else if (minutes !== '') {
      formatedNumber = `${hours}:${minutes}`;
    }
  }
  return formatedNumber;
};
