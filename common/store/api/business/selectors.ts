import { BusinessSchedule, ScheduleObject } from '@appjusto/types';
import dayjs from 'dayjs';
import { isEmpty, toNumber } from 'lodash';
import { formatTime } from '../../../utils/formatters';

const getDayIndex = (date: Date) => {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
};

const getDaySchedule = (schedule: BusinessSchedule, date: Date) => {
  return schedule[getDayIndex(date)];
};

export const scheduleFromDate = (schedule: BusinessSchedule, date: Date) => {
  const index = getDayIndex(date);
  return [...schedule.slice(index, 7), ...schedule.slice(0, index)];
};

export const isAvailable = (schedule: BusinessSchedule | undefined, date: Date) => {
  if (!schedule) return true; // is schedule is missing consider is open
  const daySchedule = getDaySchedule(schedule, date);
  return (
    daySchedule.checked &&
    (isEmpty(daySchedule.schedule) || // consider is open if empty
      !!daySchedule.schedule.find((value) => {
        const time = toNumber(formatTime(date, 'raw'));
        return time >= toNumber(value.from) && time <= toNumber(value.to);
      }))
  );
};

export const getNextAvailableDate = (schedule: BusinessSchedule, date: Date) => {
  const schedules = scheduleFromDate(schedule, date);
  const scheduleIndex = schedules.findIndex(
    (schedule, i) => schedule.checked && (i > 0 || !!findHour(schedule, date))
  );
  if (scheduleIndex === -1) return undefined;
  const daySchedule = schedules[scheduleIndex];
  if (scheduleIndex === 0) {
    return ['hoje', findHour(daySchedule, date)];
  }
  return [daySchedule.day, daySchedule.schedule[0].from];
};

const findHour = ({ schedule }: ScheduleObject, date: Date) => {
  return schedule.find((value) => toNumber(value.from) > toNumber(formatTime(date, 'raw')))?.from;
};

export const getOpeningDates = (schedules: ScheduleObject[], date: Date) =>
  schedules.reduce<Date[]>((result, { checked, schedule }, i) => {
    if (!checked) return result;
    return [
      ...result,
      ...schedule.map(({ from }) => {
        const d = new Date(date.getTime());
        d.setHours(toNumber(from.slice(0, 2)));
        d.setMinutes(toNumber(from.slice(2)));
        d.setSeconds(0);
        d.setMilliseconds(0);
        return dayjs(d).add(i, 'day').toDate();
      }),
    ];
  }, []);
