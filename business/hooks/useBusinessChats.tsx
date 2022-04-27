import { ChatMessage, Flavor, Order, WithId } from '@appjusto/types';
import { FieldValue } from 'firebase/firestore';
import React from 'react';
import { ApiContext } from '../../common/app/context';
import { getOrderChatGroup } from '../orders/helpers';

export interface OrderChatGroup {
  orderId: string;
  orderCode?: string;
  lastUpdate?: FieldValue;
  counterParts: [
    {
      id: string;
      flavor: Flavor;
      updatedOn: FieldValue;
      name?: string;
      unreadMessages?: string[];
    }
  ];
}

export const useBusinessChats = (businessId?: string, orders?: WithId<Order>[]) => {
  // context
  const api = React.useContext(ApiContext);
  //state
  const [totalOrdersIds, setTotalOrdersIds] = React.useState<string[]>([]);
  const [chatMessages, setChatMessages] = React.useState<WithId<ChatMessage>[]>([]);
  const [orderChatGroup, setOrderChatGroup] = React.useState<OrderChatGroup[]>([]);
  // side effects
  React.useEffect(() => {
    if (!orders) return;
    const ordersIds = [...orders].map((order) => order.id);
    setTotalOrdersIds(ordersIds);
  }, [orders]);

  React.useEffect(() => {
    if (!businessId) return;
    if (totalOrdersIds.length === 0) {
      setOrderChatGroup([]);
      return;
    }
    const unsubsPromise = api
      .order()
      .observeBusinessActiveChatMessages(
        businessId,
        totalOrdersIds,
        (messages: WithId<ChatMessage>[]) => {
          setChatMessages((prev) => {
            const newMessagesIds = messages.map((msg) => msg.id);
            const filteredPrev = prev.filter((msg) => !newMessagesIds.includes(msg.id));
            const update = [...filteredPrev, ...messages];
            return update.filter((msg) => totalOrdersIds.includes(msg.orderId));
          });
        }
      );
    return () => {
      unsubsPromise.then((unsubs) => unsubs.forEach((unsub) => unsub()));
    };
  }, [api, businessId, totalOrdersIds]);
  React.useEffect(() => {
    if (!businessId) return;
    const result = getOrderChatGroup(businessId, chatMessages);
    setOrderChatGroup(result);
  }, [businessId, chatMessages]);
  // return
  return orderChatGroup;
};
