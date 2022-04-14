import {
  BusinessSchedule,
  ChatMessage,
  Order,
  OrderCancellationParams,
  WithId,
} from '@appjusto/types';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { OrderChatGroup } from '../hooks/useBusinessChats';
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

export const getOrderChatGroup = (businessId: string, messages: WithId<ChatMessage>[]) => {
  return messages.reduce<OrderChatGroup[]>((groups, message) => {
    const existingGroup = groups.find((group) => group.orderId === message.orderId);
    const counterPartId = businessId === message.from.id ? message.to.id : message.from.id;
    const counterPart = counterPartId === message.from.id ? message.from : message.to;
    const counterPartFlavor = counterPart.agent;
    const isUnread = message.from.id !== businessId && !message.read;
    const counterPartObject = {
      id: counterPartId,
      flavor: counterPartFlavor,
      updatedOn: message.timestamp,
      unreadMessages: isUnread ? [message.id] : [],
    };
    if (existingGroup) {
      const existingCounterpart = existingGroup.counterParts.find(
        (part) => part.id === counterPartId
      );
      if (existingCounterpart) {
        if (
          isUnread &&
          (!existingCounterpart.unreadMessages ||
            !existingCounterpart.unreadMessages?.includes(message.id))
        ) {
          if (existingCounterpart.unreadMessages)
            existingCounterpart.unreadMessages.push(message.id);
          else existingCounterpart.unreadMessages = [message.id];
        } else {
          existingCounterpart.unreadMessages = existingCounterpart.unreadMessages?.filter(
            (msg) => msg !== message.id
          );
        }
        if (existingCounterpart.updatedOn < message.timestamp) {
          existingCounterpart.updatedOn = message.timestamp;
        }
        return groups;
      }
      if (counterPartFlavor === 'courier') {
        const currentCourierIndex = existingGroup.counterParts.findIndex(
          (part) => part.flavor === 'courier'
        );
        if (currentCourierIndex > -1) {
          existingGroup.counterParts[currentCourierIndex] = counterPartObject;
          return groups;
        }
      }
      existingGroup.counterParts.push(counterPartObject);
      return groups;
    }
    return [
      {
        orderId: message.orderId,
        lastUpdate: message.timestamp,
        counterParts: [counterPartObject],
      },
      ...groups,
    ];
  }, []);
};
