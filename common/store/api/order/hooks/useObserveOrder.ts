import { ChatMessage, Order, WithId } from 'appjusto-types';
import React from 'react';
import { ApiContext } from '../../../../app/context';

export default function (orderId: string) {
  // context
  const api = React.useContext(ApiContext);

  // app state
  const [order, setOrder] = React.useState<WithId<Order>>();
  const [chat, setChat] = React.useState<WithId<ChatMessage>[]>();

  // side effects
  // observe order
  React.useEffect(() => {
    return api.order().observeOrder(orderId, setOrder);
  }, [orderId]);
  // observe chat
  React.useEffect(() => {
    return api.order().observeOrderChat(orderId, setChat);
  }, [orderId]);

  return { order, chat };
}
