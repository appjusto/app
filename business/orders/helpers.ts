import { BusinessSchedule, OrderStatus } from '@appjusto/types';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);

export const acceptStatuses = ('confirmed' || 'preparing' || 'ready') as OrderStatus;
export const cancellableStatuses = ('preparing' || 'ready') as OrderStatus;
export const cookingTimeStatuses = ('confirmed' || 'preparing') as OrderStatus;

export const businessShouldBeOpen = (today: Date, schedules: BusinessSchedule) => {
  if (!today || !schedules) {
    console.error('businessShouldBeOpen invalid args!');
    return false;
  }
  const day = today.getDay();
  const dayIndex = day === 0 ? 6 : day - 1;
  const daySchedule = schedules[dayIndex];
  let n = 0;
  let shouldBeOpen = false;
  while (daySchedule.schedule.length > n && shouldBeOpen === false) {
    const period = daySchedule.schedule[n];
    const startH = parseInt(period.from.slice(0, 2));
    const startM = parseInt(period.from.slice(2, 4));
    const endH = parseInt(period.to.slice(0, 2));
    const endM = parseInt(period.to.slice(2, 4));
    const openTime = dayjs().hour(startH).minute(startM).second(0);
    const closeTime = dayjs().hour(endH).minute(endM).second(0);
    shouldBeOpen = openTime.isSameOrBefore(today) && closeTime.isAfter(today);
    n++;
  }
  return shouldBeOpen;
};
