import { ChatMessage, WithId } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../../../app/context';

export const useObserveOrderChat = (orderId: string, userId: string, counterpartId: string) => {
  // context
  const api = React.useContext(ApiContext);
  // app state
  const [chatFromUser, setChatFromUser] = React.useState<WithId<ChatMessage>[]>([]);
  const [chatFromCounterPart, setChatFromCounterPart] = React.useState<WithId<ChatMessage>[]>([]);
  const timestampToDate = (value: firebase.firestore.FieldValue) =>
    (value as firebase.firestore.Timestamp).toDate();
  // side effects
  // observe chat
  React.useEffect(() => {
    if (!orderId) return;
    const chatUserCounterpart = api
      .order()
      .observeOrderChat(orderId, userId, counterpartId, setChatFromUser); // the function that expects 4 arguments is commented in the code.
    const chatCounterPartUser = api
      .order()
      .observeOrderChat(orderId, counterpartId, userId, setChatFromCounterPart);
    return () => {
      chatUserCounterpart();
      console.log('chat from user sent');
      chatCounterPartUser();
      console.log('chat from counterpart sent');
    };
  }, [api, orderId, userId, counterpartId]);
  // result
  return chatFromUser
    .concat(chatFromCounterPart)
    .sort(
      (a, b) => timestampToDate(b.timestamp).getTime() - timestampToDate(a.timestamp).getTime()
    );
};
