import { last } from 'lodash';
import { normalize } from 'normalizr';
import { AnyAction } from 'redux';

import { ORDERS_UPDATED, ORDER_CHAT_UPDATED } from './actions';
import * as schema from './schema';
import { OrderState, ChatMessage, GroupedChatMessages } from './types';
import { nanoid } from 'nanoid/non-secure';

const initialState: OrderState = {
  orders: [],
  ordersById: {},
  chatByOrderId: {},
};

export default function (state: OrderState = initialState, action: AnyAction): OrderState {
  const { type, payload } = action;
  switch (type) {
    case ORDERS_UPDATED: {
      const ordersById = normalize(payload, [schema.order]).entities.orders ?? {};
      return { ...state, orders: payload, ordersById };
    }
    case ORDER_CHAT_UPDATED: {
      const { orderId, messages }: { orderId: string; messages: ChatMessage[] } = payload;
      const chat = groupMessagesByAuthor(messages);
      const chatByOrderId = { ...state.chatByOrderId, [orderId]: chat };
      return { ...state, chatByOrderId };
    }
    default:
      return state;
  }
}

const groupMessagesByAuthor = (newMessages: ChatMessage[]): GroupedChatMessages[] => {
  return newMessages.reduce<GroupedChatMessages[]>((groups, message) => {
    const currentGroup = last(groups);
    if (message.from === currentGroup?.from) {
      currentGroup.messages.push(message);
      return groups;
    }
    return [{ id: nanoid(), from: message.from, messages: [message] }];
  }, []);
};
