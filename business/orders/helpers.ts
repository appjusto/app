import {
  BusinessSchedule,
  ChatMessage,
  Order,
  OrderCancellationParams,
  WithId,
} from '@appjusto/types';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { round } from 'lodash';

dayjs.extend(isSameOrBefore);

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

export const calculateCancellationCosts = (order: Order, params: OrderCancellationParams) => {
  let costs = 0;
  if (order.fare?.business && params.refund.indexOf('products') !== -1)
    costs += order.fare.business.value;
  if (order.fare?.courier && params.refund.indexOf('delivery') !== -1)
    costs += order.fare.courier.value;
  if (order.fare?.platform && params.refund.indexOf('platform') !== -1)
    costs += order.fare.platform.value;
  return costs;
};

export const getConversationKey = (message: ChatMessage) =>
  `${message.orderId}-${message.participantsIds.sort()}`;

export const getConversations = (messages: WithId<ChatMessage>[]) => {
  const byOrder = new Map<string, WithId<ChatMessage>[]>();
  messages.forEach((message) => {
    const key = getConversationKey(message);
    byOrder.set(key, [...(byOrder.get(key) ?? []), message]);
  });
  return Array.from(byOrder.values());
};

export const getTimeUntilNow = (serverTime: number, baseTime: number, reverse: boolean = false) => {
  if (reverse) {
    let elapsedTime = (baseTime - serverTime) / 1000 / 60;
    if (elapsedTime < 0) elapsedTime = 0;
    return round(elapsedTime, 0);
  }
  const elapsedTime = (serverTime - baseTime) / 1000 / 60;
  return round(elapsedTime, 0);
};
