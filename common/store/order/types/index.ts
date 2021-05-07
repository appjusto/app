import { ChatMessage, Order, WithId } from '@appjusto/types';

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
}
