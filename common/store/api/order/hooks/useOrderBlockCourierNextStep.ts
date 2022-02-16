import React from 'react';
import { ApiContext } from '../../../../app/context';
import { usePlatformParamsContext } from '../../../../contexts/PlatformParamsContext';
import { useContextGetSeverTime } from '../../../../contexts/ServerTimeContext';
import { useObserveOrder } from './useObserveOrder';

const canAdvanceDispatchingState = (
  now: Date,
  delayBeforeAdvancing: number,
  currentStateTimestamp: firebase.firestore.FieldValue | undefined
) => {
  if (!currentStateTimestamp) return false;
  const timestamp = (currentStateTimestamp as firebase.firestore.Timestamp).toDate();
  const diff = now.getTime() - timestamp.getTime();
  if (diff === 0) return false;
  return diff >= delayBeforeAdvancing * 1000;
};

export const useOrderBlockCourierNextStep = (orderId: string) => {
  // context
  const api = React.useContext(ApiContext);
  const getServerTime = useContextGetSeverTime()!;
  const delayBeforeAdvancing = usePlatformParamsContext()?.courier.delayBeforeAdvancing ?? 60;
  // state
  const order = useObserveOrder(orderId);
  const [blockNextStep, setBlockNextStep] = React.useState(false);
  // side effects
  React.useEffect(() => {
    if (!order) return;
    if (!getServerTime) return;
    const { type, status, dispatchingState, dispatchingTimestamps } = order;
    const now = getServerTime();
    if (dispatchingState === 'going-pickup') {
      setBlockNextStep(
        canAdvanceDispatchingState(now, delayBeforeAdvancing, dispatchingTimestamps.goingPickup)
      );
    } else if (dispatchingState === 'arrived-pickup') {
      setBlockNextStep(type === 'food' && status !== 'dispatching');
    } else if (dispatchingState === 'going-destination') {
      setBlockNextStep(
        canAdvanceDispatchingState(
          now,
          delayBeforeAdvancing,
          dispatchingTimestamps.goingDestination
        )
      );
    } else {
      setBlockNextStep(false);
    }
  }, [order, delayBeforeAdvancing, getServerTime]);
  // result
  return blockNextStep;
};
