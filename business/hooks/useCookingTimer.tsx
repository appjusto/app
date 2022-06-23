import { Order, WithId } from '@appjusto/types';
import { Timestamp } from 'firebase/firestore';
import { round } from 'lodash';
import React from 'react';
import { useContextGetSeverTime } from '../../common/contexts/ServerTimeContext';
import { Dayjs } from '../../strings';

export const useCookingTimer = (order?: WithId<Order> | null) => {
  // context
  const getServerTime = useContextGetSeverTime();
  // state
  const [elapsed, setElapsed] = React.useState<string>();
  const [progress, setProgress] = React.useState<string>();

  const update = () => {
    if (!getServerTime) return;
    if (!order?.timestamps.confirmed) return;
    if (!order?.cookingTime) return;
    const { cookingTime, timestamps } = order;
    const now = getServerTime().getTime();
    const confirmedAt = (timestamps.confirmed as Timestamp).toDate().getTime();
    const delta = Dayjs(now).diff(confirmedAt, 'minute');
    setElapsed(Dayjs.duration(delta, 'minutes').humanize());
    const cookingProgress = round(
      cookingTime > 0 && delta > 0 ? (delta / (cookingTime / 60)) * 100 : 0,
      0
    );
    setProgress(`${cookingProgress}%`);
  };
  React.useEffect(() => {
    if (order?.id) update();
  }, [order?.id]);
  // also updating every minute
  React.useEffect(() => {
    if (order?.status === 'preparing') {
      const interval = setInterval(update, 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [order?.status]);

  return { elapsed, progress };
};
