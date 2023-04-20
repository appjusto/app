import { Order, WithId } from '@appjusto/types';
import { Timestamp } from 'firebase/firestore';
import { usePlatformParamsContext } from '../contexts/PlatformParamsContext';
import { useContextGetSeverTime } from '../contexts/ServerTimeContext';

export const useShouldDelayBeforeAdvancing = (order?: WithId<Order> | null) => {
  const getServerTime = useContextGetSeverTime();
  const delayBeforeAdvancing =
    (usePlatformParamsContext()?.courier?.delayBeforeAdvancing ?? 60) * 1000;
  if (!order) return false;
  if (!getServerTime) return false;
  const dispatchingStartedOn = order.timestamps.dispatching;
  return (
    getServerTime().getTime() - (dispatchingStartedOn as Timestamp).toDate().getTime() <
    delayBeforeAdvancing
  );
};
