import { Order, WithId } from '@appjusto/types';
import firebase from 'firebase/compat';
import { usePlatformParamsContext } from '../contexts/PlatformParamsContext';
import { useContextGetSeverTime } from '../contexts/ServerTimeContext';

export const useShouldDelayBeforeAdvancing = (order?: WithId<Order> | null) => {
  const delayBeforeAdvancing =
    (usePlatformParamsContext()?.courier.delayBeforeAdvancing ?? 60) * 1000;
  const getServerTime = useContextGetSeverTime();
  if (!getServerTime) return false;
  if (!order) return false;
  const dispatchingStartedOn = order.timestamps?.dispatching ?? order.dispatchingStartedOn;
  return (
    getServerTime().getTime() -
      (dispatchingStartedOn as firebase.firestore.Timestamp).toDate().getTime() <
    delayBeforeAdvancing
  );
};
