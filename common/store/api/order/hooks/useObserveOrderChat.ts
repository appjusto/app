import { ChatMessage, WithId } from '@appjusto/types';
import { first } from 'lodash';
import React from 'react';
import { ApiContext } from '../../../../app/context';
import { GroupedChatMessages } from '../../../order/types';

export const useObserveOrderChat = (orderId: string, userId: string, counterpartId?: string) => {
  // context
  const api = React.useContext(ApiContext);
  // app state
  const [chatFromUser, setChatFromUser] = React.useState<WithId<ChatMessage>[]>([]);
  const [chatFromCounterPart, setChatFromCounterPart] = React.useState<WithId<ChatMessage>[]>([]);
  const [chat, setChat] = React.useState<GroupedChatMessages[]>([]);
  // side effects
  // observe chat
  React.useEffect(() => {
    if (!orderId) return;
    const unsub = api.order().observeOrderChat(orderId, userId, counterpartId, setChatFromUser);
    const unsub2 = api
      .order()
      .observeOrderChat(orderId, counterpartId, userId, setChatFromCounterPart);
    return () => {
      unsub();
      unsub2();
    };
  }, [api, orderId, userId, counterpartId]);
  // group messages whenever chat updates
  React.useEffect(() => {
    setChat(groupOrderChatMessages(chatFromUser.concat(chatFromCounterPart).sort(sortMessages)));
  }, [chatFromUser, chatFromCounterPart]);
  // result
  return chat;
};

const timestampToDate = (value: firebase.firestore.FieldValue) =>
  (value as firebase.firestore.Timestamp).toDate();

const sortMessages = (a: ChatMessage, b: ChatMessage) => {
  if (a.timestamp && b.timestamp)
    return timestampToDate(a.timestamp).getTime() - timestampToDate(b.timestamp).getTime();
  if (!a.timestamp) return 1;
  else if (!b.timestamp) return -1;
  return 0;
};

const groupOrderChatMessages = (messages: WithId<ChatMessage>[]) =>
  messages.reduce<GroupedChatMessages[]>((groups, message) => {
    const currentGroup = first(groups);
    if (message.from.id === currentGroup?.from) {
      currentGroup!.messages.push(message);
      return groups;
    }
    // use as id for chat group the id of the first message of the group
    return [{ id: message.id, from: message.from.id, messages: [message] }, ...groups];
  }, []);

export const unreadMessages = (chat: GroupedChatMessages[], toId: string) =>
  chat.reduce((result, group) => {
    return [
      ...result,
      ...group.messages.filter((message) => message.to.id === toId && !message.read),
    ];
  }, [] as WithId<ChatMessage>[]);
