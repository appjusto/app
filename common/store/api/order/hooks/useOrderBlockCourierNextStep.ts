import React from 'react';
import { ApiContext } from '../../../../app/context';
import { usePlatformParamsContext } from '../../../../contexts/PlatformParamsContext';
import { useObserveOrder } from './useObserveOrder';
import { useOrderDispatchingStateElapsedSeconds } from './useOrderDispatchingStateElapsedSeconds';

export const useOrderBlockCourierNextStep = (orderId: string) => {
  // context
  const api = React.useContext(ApiContext);
  const delayBeforeAdvancing = usePlatformParamsContext()?.courier.delayBeforeAdvancing ?? 60;
  // state
  const secondsSinceGoingPickup = useOrderDispatchingStateElapsedSeconds(orderId, 'going-pickup');
  const secondsSinceGoingDestination = useOrderDispatchingStateElapsedSeconds(
    orderId,
    'going-destination'
  );
  const order = useObserveOrder(orderId);
  const [blockNextStep, setBlockNextStep] = React.useState(false);
  // side effects
  React.useEffect(() => {
    if (!delayBeforeAdvancing) return;
    if (!order) return;
    const { status, dispatchingState, type } = order;
    if (dispatchingState === 'going-pickup') {
      setBlockNextStep(
        secondsSinceGoingPickup !== undefined && secondsSinceGoingPickup < delayBeforeAdvancing
      );
    } else if (dispatchingState === 'arrived-pickup') {
      setBlockNextStep(type === 'food' && status !== 'dispatching');
    } else if (dispatchingState === 'going-destination') {
      setBlockNextStep(
        secondsSinceGoingDestination !== undefined &&
          secondsSinceGoingDestination < delayBeforeAdvancing
      );
    } else {
      setBlockNextStep(false);
    }
  }, [delayBeforeAdvancing, api, order, secondsSinceGoingPickup, secondsSinceGoingDestination]);
  // result
  return blockNextStep;
};
