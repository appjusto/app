import { Order, WithId } from '../../../types';
import { useContextGetSeverTime } from '../contexts/ServerTimeContext';

export const useChatisEnabled = (order?: WithId<Order>) => {
  const getServerTime = useContextGetSeverTime();
  if (!order) return false;
  if (!getServerTime) return false;
  const { status } = order;
  let time;
  if (status === 'delivered') time = order.deliveredOn;
  else if (status === 'canceled') time = order.createdOn;
  return (
    ['preparing', 'ready', 'dispatching'].includes(status) ||
    (['delivered', 'canceled'].includes(status) &&
      getServerTime().getTime() - (time as firebase.firestore.Timestamp).toDate().getTime() <
        3600000)
  );
};
