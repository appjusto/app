import { Order, WithId } from '@appjusto/types';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { useContextGetSeverTime } from '../../common/contexts/ServerTimeContext';
import { getTimeUntilNow } from '../orders/helpers';

export const useCookingTimer = (order?: WithId<Order> | null) => {
  // context
  const getServerTime = useContextGetSeverTime();
  // state
  const [progress, setProgress] = React.useState<number>();
  const [barProgress, setBarProgress] = React.useState<number | string>();
  const [ticking] = React.useState(true);

  const update = React.useCallback(() => {
    if (!getServerTime) return;
    if (!order?.timestamps.confirmed) return;
    if (!order?.cookingTime) return;
    const { cookingTime, timestamps } = order;
    const now = getServerTime().getTime();
    const confirmedAt = (timestamps.confirmed as Timestamp).toDate().getTime();
    const delta = getTimeUntilNow(now, confirmedAt);
    setProgress(delta);
    const cookingProgress = cookingTime && delta ? (delta / (cookingTime / 60)) * 100 : 0;
    setBarProgress(`${cookingProgress}%`);
  }, [getServerTime, order?.cookingTime, order?.timestamps.confirmed]);

  // updating every time the component re-renders (for user "provoked" reloads)
  React.useEffect(() => {
    update();
  });
  // also updating every minute
  React.useEffect(() => {
    if (ticking && order?.status === 'preparing') {
      const interval = setInterval(update, 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [ticking, order?.status]);

  return { progress, barProgress };
};
