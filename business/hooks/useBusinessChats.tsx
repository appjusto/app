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

export const useBusinessChats = (businessId?: string, activeOrders?: WithId<Order>[]) => {
  // context
  const api = React.useContext(ApiContext);
  //state
  const [totalActiveOrdersIds, setTotalActiveOrdersIds] = React.useState<string[]>([]);
  const [chatMessages, setChatMessages] = React.useState<WithId<ChatMessage>[]>([]);
  const [orderChatGroup, setOrderChatGroup] = React.useState<OrderChatGroup[]>([]);
  // side effects
  React.useEffect(() => {
    if (!activeOrders) return;
    const activeOrdersIds = [...activeOrders].map((order) => order.id);
    setTotalActiveOrdersIds(activeOrdersIds);
  }, [activeOrders]);

  React.useEffect(() => {
    if (!businessId) return;
    if (totalActiveOrdersIds.length === 0) {
      setOrderChatGroup([]);
      return;
    }
    const unsubsPromise = api
      .order()
      .observeBusinessActiveChats(
        businessId,
        totalActiveOrdersIds,
        (messages: WithId<ChatMessage>[]) => {
          setChatMessages((prev) => {
            const newMessagesIds = messages.map((msg) => msg.id);
            const filteredPrev = prev.filter((msg) => !newMessagesIds.includes(msg.id));
            const update = [...filteredPrev, ...messages];
            return update.filter((msg) => totalActiveOrdersIds.includes(msg.orderId));
          });
        }
      );
    return () => {
      unsubsPromise.then((unsubs) => unsubs.forEach((unsub) => unsub()));
    };
  }, [api, businessId, totalActiveOrdersIds]);
  React.useEffect(() => {
    if (!businessId) return;
    const result = getOrderChatGroup(businessId, chatMessages);
    setOrderChatGroup(result);
  }, [businessId, chatMessages]);
  // return
  return orderChatGroup;
};
