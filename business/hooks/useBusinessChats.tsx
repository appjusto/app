import { ChatMessage, Order, WithId } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../common/app/context';
import { groupOrderChatMessages } from '../../common/store/api/order/hooks/useObserveOrderChat';
import { GroupedChatMessages } from '../../common/store/order/types';
import { useIds } from '../../common/utils/useIds';
import { getConversations } from '../orders/helpers';

export const useBusinessChats = (businessId?: string, orders?: WithId<Order>[]) => {
  // context
  const api = React.useContext(ApiContext);
  //state
  const ordersIds = useIds(orders);
  const [chatMessages, setChatMessages] = React.useState<WithId<ChatMessage>[]>([]);
  const [orderChatGroup, setOrderChatGroup] = React.useState<GroupedChatMessages[][]>([]);
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    if (ordersIds.length === 0) {
      setOrderChatGroup([]);
      return;
    }
    const unsubsPromise = api
      .order()
      .observeBusinessActiveChatMessages(
        businessId,
        ordersIds,
        (messages: WithId<ChatMessage>[]) => {
          setChatMessages((prev) => {
            const newMessagesIds = messages.map((msg) => msg.id);
            const filteredPrev = prev.filter((msg) => !newMessagesIds.includes(msg.id));
            const update = [...filteredPrev, ...messages];
            return update.filter((msg) => ordersIds.includes(msg.orderId));
          });
        }
      );
    return () => {
      unsubsPromise.then((unsubs) => unsubs.forEach((unsub) => unsub()));
    };
  }, [api, businessId, ordersIds]);
  React.useEffect(() => {
    if (!businessId) return;
    console.log('chatMessages', chatMessages);
    const conversations = getConversations(chatMessages);
    setOrderChatGroup(conversations.map((messages) => groupOrderChatMessages(messages)));
  }, [businessId, chatMessages]);
  // return
  return orderChatGroup;
};
