import { Order, OrderStatus, WithId } from '@appjusto/types';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useContextGetSeverTime } from '../contexts/ServerTimeContext';

export const useChatIsEnabled = (order?: WithId<Order> | null) => {
  const getServerTime = useContextGetSeverTime();
  if (!order) return false;
  if (!getServerTime) return false;
  const { status, timestamps, updatedOn } = order;
  if ((['preparing', 'ready', 'dispatching'] as OrderStatus[]).includes(status)) return true;
  if (!(['delivered', 'canceled'] as OrderStatus[]).includes(status)) return false;
  const time =
    status === 'delivered' ? timestamps.delivered ?? updatedOn : timestamps.canceled ?? updatedOn;
  return (
    getServerTime().getTime() - (time as FirebaseFirestoreTypes.Timestamp).toDate().getTime() <
    60 * 60 * 1000
  );
};
