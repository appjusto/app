import { Dayjs } from '@appjusto/dates';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { useSelector } from 'react-redux';
import { useContextGetSeverTime } from '../../../../contexts/ServerTimeContext';
import { getUser } from '../../../user/selectors';
import { useObserveOrders } from '../hooks/useObserveOrders';
import { ObserveOrdersOptions } from '../types';
import { getOrderRevenue } from './getOrderRevenue';

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
      if (!order.fare?.courier?.value) return;
      const value = getOrderRevenue(order);
      week += value;
      if (Dayjs((order.createdOn as Timestamp).toDate()).diff(getServerTime(), 'day') === 0) {
        today += value;
      }
    });
    setResult({ today, week });
  }, [getServerTime, orders]);
  // result
  return result;
};
