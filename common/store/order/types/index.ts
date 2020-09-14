import { Order } from 'appjusto-types';

export interface ChatMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: firebase.firestore.Timestamp;
}

export interface GroupedChatMessages {
  id: string;
  from: string;
  messages: ChatMessage[];
}

export interface OrderMatchRequest {
  orderId: string;
  courierFee: string;
  distanceToOrigin: number;
  totalDistance: number;
  originAddress: string;
  destinationAddress: string;
}

export interface OrderState {
  orders: Order[];
  ordersById: {
    [key: string]: Order;
  };
  chatByOrderId: {
    [key: string]: ChatMessage[];
  };
}
