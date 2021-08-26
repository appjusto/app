import { Order, WithId } from '../../../types';
import { useContextGetSeverTime } from '../contexts/ServerTimeContext';

export const useChatAfterCompletion = (order?: WithId<Order>) => {
  const getServerTime = useContextGetSeverTime();
  if (!order) return false;
  if (!getServerTime) return false;
  const { status } = order;
  const getOrderFinishedTime = () => {
    if (status === 'canceled') return order.updatedOn;
    if (status === 'delivered') return order.deliveredOn;
  };
  return true;
};
