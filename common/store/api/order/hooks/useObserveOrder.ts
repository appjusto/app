import { ChatMessage, Order, WithId } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../../../app/context';

export default function (orderId: string | undefined) {
  // context
  const api = React.useContext(ApiContext);

  // app state
  const [order, setOrder] = React.useState<WithId<Order>>();
  const [chat, setChat] = React.useState<WithId<ChatMessage>[]>();

  // side effects
  // observe order
  React.useEffect(() => {
    if (!orderId) return;
    return api.order().observeOrder(orderId, setOrder);
  }, [orderId]);
  // observe chat
  React.useEffect(() => {
    if (!orderId) return;
    return api.order().observeOrderChat(orderId, setChat);
  }, [orderId]);

  return { order, chat };
}

// export const useObserveOrder = (orderId: string | undefined) => {
//   // context
//   const api = React.useContext(ApiContext);
//   // app state
//   const [order, setOrder] = React.useState<WithId<Order>>();
//   // side effects
//   // observe order
//   React.useEffect(() => {
//     if (!orderId) return;
//     return api.order().observeOrder(orderId, setOrder);
//   }, [api, orderId]);
//   // result
//   return order;
// };
