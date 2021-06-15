import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../app/context';
import { ORDERS_UPDATED } from '../../../order/actions';
import { OngoingOrdersStatuses } from '../../../order/selectors';
import { ObserveOrdersOptions } from '../types';
import { useObserveOrders } from './useObserveOrders';

export const useObserveOngoingOrders = (options: ObserveOrdersOptions) => {
  // context
  const dispatch = useDispatch<AppDispatch>();
  // state
  const orders = useObserveOrders(
    React.useMemo(() => ({ ...options, statuses: OngoingOrdersStatuses }), [options])
  );
  // side effects
  React.useEffect(() => {
    dispatch({ type: ORDERS_UPDATED, payload: orders });
  }, [dispatch, orders]);
};
