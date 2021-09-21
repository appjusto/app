import { BusinessSchedule, ScheduleObject } from '@appjusto/types';
import { toNumber } from 'lodash';
import { formatTime } from '../../../utils/formatters';

export const isAvailable = (schedule: BusinessSchedule | undefined, date: Date) => {
  if (!schedule) return true;

  const day = date.getDay();
  const index = day === 0 ? 6 : day - 1;
  const daySchedule = schedule[index];
  return (
    daySchedule.checked &&
    daySchedule.schedule.find((value) => {
      const time = toNumber(formatTime(date, 'raw'));
      return time > toNumber(value.from) && time < toNumber(value.to);
    })
  );
};

export const getNextAvailableDate = (schedule: BusinessSchedule, date: Date) => {
  const day = date.getDay();
  const index = day === 0 ? 6 : day - 1;
  const schedules = [...schedule.slice(index, 7), ...schedule.slice(0, index)];
  const scheduleIndex = schedules.findIndex(
    (schedule, i) => schedule.checked && (i > 0 || findHour(schedule) !== undefined)
  );
  if (scheduleIndex === -1) return undefined;
  const daySchedule = schedules[scheduleIndex];
  if (scheduleIndex === 0) {
    return ['hoje', findHour(daySchedule)];
  }
  return [daySchedule.day, daySchedule.schedule[0].from];
};

const findHour = ({ schedule }: ScheduleObject) => {
  const now = new Date();
  return schedule.find((value) => toNumber(value.from) > toNumber(formatTime(now, 'raw')))?.from;
};
