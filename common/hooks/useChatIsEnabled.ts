import { Order, WithId } from '@appjusto/types';
import firebase from 'firebase';
import { useContextGetSeverTime } from '../contexts/ServerTimeContext';

export const useChatisEnabled = (order?: WithId<Order> | null) => {
  const getServerTime = useContextGetSeverTime();
  if (!order) return false;
  if (!getServerTime) return false;
  const { status } = order;
  let time;
  if (status === 'delivered') time = order.timestamps?.delivered ?? order.deliveredOn;
  else if (status === 'canceled') time = order.updatedOn;
  return (
    ['preparing', 'ready', 'dispatching'].includes(status) ||
    (['delivered', 'canceled'].includes(status) &&
      getServerTime().getTime() - (time as firebase.firestore.Timestamp).toDate().getTime() <
        60 * 60 * 1000)
  );
};
