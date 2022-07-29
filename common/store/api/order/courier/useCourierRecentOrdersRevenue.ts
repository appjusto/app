import { Dayjs } from '@appjusto/dates';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { useSelector } from 'react-redux';
import { useContextGetSeverTime } from '../../../../contexts/ServerTimeContext';
import { getUser } from '../../../user/selectors';
import { useObserveOrders } from '../hooks/useObserveOrders';
import { ObserveOrdersOptions } from '../types';

interface Result {
  today: number;
  week: number;
}

export const useCourierRecentOrdersRevenue = () => {
  // context
  const getServerTime = useContextGetSeverTime();
  // redux
  const user = useSelector(getUser)!;
  // refs
  const optionsRef = React.useRef<ObserveOrdersOptions>({
    courierId: user.uid,
    from: Dayjs(getServerTime()).startOf('w').toDate(),
  });
  // state
  const orders = useObserveOrders(optionsRef.current);
  const [result, setResult] = React.useState<Result>();
  // side effects
  React.useEffect(() => {
    if (!orders) return;
    let today = 0;
    let week = 0;
    orders.forEach((order) => {
      const value = order.fare?.courier?.value ?? 0;
      const processingFee = order?.fare?.courier?.processingFee ?? 0;
      const revenue = value - processingFee;
      week += revenue;
      if (Dayjs((order.createdOn as Timestamp).toDate()).diff(getServerTime(), 'day') === 0) {
        today += revenue;
      }
    });
    setResult({ today, week });
  }, [orders]);
  // result
  return result;
};
