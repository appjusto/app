import { Timestamp } from '@appjusto/types/external/firebase';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import React from 'react';
import { usePlatformParamsContext } from '../../../../contexts/PlatformParamsContext';
import { useContextGetSeverTime } from '../../../../contexts/ServerTimeContext';
import { useObserveOrder } from './useObserveOrder';

const canAdvanceDispatchingState = (
  now: Date,
  delayBeforeAdvancing: number,
  currentStateTimestamp: Timestamp | undefined
) => {
  if (!currentStateTimestamp) return false;
  const timestamp = (currentStateTimestamp as FirebaseFirestoreTypes.Timestamp).toDate();
  const diff = now.getTime() - timestamp.getTime();
  if (diff === 0) return false;
  return diff >= delayBeforeAdvancing * 1000;
};

export const useOrderBlockCourierNextStep = (orderId: string) => {
  // context
  const getServerTime = useContextGetSeverTime();
  const delayBeforeAdvancing = usePlatformParamsContext()?.courier.delayBeforeAdvancing ?? 60;
  // state
  const order = useObserveOrder(orderId);
  const [blockNextStep, setBlockNextStep] = React.useState(false);
  const [ticking, setTicking] = React.useState(false);
  const [tick, setTick] = React.useState(0);
  // side effects
  React.useEffect(() => {
    if (ticking) {
      const interval = setInterval(() => setTick((value) => value + 5), 5000);
      return () => clearInterval(interval);
    }
  }, [ticking]);
  const { type, status, dispatchingState, dispatchingTimestamps } = order ?? {};
  const { goingPickup, goingDestination } = dispatchingTimestamps ?? {};
  React.useEffect(() => {
    if (!dispatchingState) return;
    if (!getServerTime) return;
    const now = getServerTime();
    if (dispatchingState === 'going-pickup') {
      const block = !canAdvanceDispatchingState(now, delayBeforeAdvancing, goingPickup);
      setBlockNextStep(block);
      setTicking(block);
    } else if (dispatchingState === 'arrived-pickup') {
      setTicking(false);
      setBlockNextStep(type === 'food' && status !== 'dispatching');
    } else if (dispatchingState === 'going-destination') {
      const block = !canAdvanceDispatchingState(now, delayBeforeAdvancing, goingDestination);
      setBlockNextStep(block);
      setTicking(block);
    } else {
      setBlockNextStep(false);
      setTicking(false);
    }
  }, [
    type,
    status,
    dispatchingState,
    goingPickup,
    goingDestination,
    delayBeforeAdvancing,
    getServerTime,
    tick,
  ]);
  // result
  return blockNextStep;
};
