import { Order, ChatMessage, WithId } from 'appjusto-types';

export interface GroupedChatMessages {
  id: string;
  from: string;
  messages: WithId<ChatMessage>[];
}

export interface OrderState {
  orders: WithId<Order>[];
  ordersById: {
    [key: string]: WithId<Order>;
  };
  chatByOrderId: {
    [key: string]: WithId<ChatMessage>[];
  };
  lastChatMessageReadByOrderId: {
    [key: string]: WithId<ChatMessage>;
  };
}
