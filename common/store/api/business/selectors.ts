import { Business } from '@appjusto/types';
import { ScheduleObject } from '@appjusto/types/business';
import { toNumber } from 'lodash';
import { formatTime } from '../../../utils/formatters';

export const getBusinessNextOpeningDay = (business: Business) => {
  const now = new Date();
  const day = now.getDay();
  const index = day === 0 ? 6 : day - 1;
  const schedules = [...business.schedules.slice(index, 7), ...business.schedules.slice(0, index)];
  const scheduleIndex = schedules.findIndex(
    (schedule, i) => schedule.checked && (i > 0 || findHour(schedule) !== undefined)
  );
  if (scheduleIndex === -1) return undefined;
  const schedule = schedules[scheduleIndex];
  if (scheduleIndex === 0) {
    return ['hoje', findHour(schedule)];
  }
  return [schedule.day, schedule.schedule[0].from];
};

const findHour = ({ schedule }: ScheduleObject) => {
  const now = new Date();
  return schedule.find((value) => toNumber(value.from) > toNumber(formatTime(now, 'raw')))?.from;
};
