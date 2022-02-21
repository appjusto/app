import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../app/context';
import { getFlavor } from '../../../config/selectors';
import { ORDERS_UPDATED } from '../../../order/actions';
import { OngoingOrdersStatuses } from '../../../order/selectors';
import { ObserveOrdersOptions } from '../types';
import { useObserveOrders } from './useObserveOrders';

export const useObserveOngoingOrders = (options: ObserveOrdersOptions) => {
  // context
  const flavor = useSelector(getFlavor);
  const dispatch = useDispatch<AppDispatch>();
  // state
  const orders = useObserveOrders(
    React.useMemo(
      () => ({
        ...options,
        statuses: OngoingOrdersStatuses.concat(flavor === 'consumer' ? ['declined'] : []),
      }),
      [options, flavor]
    )
  );
  // side effects
  React.useEffect(() => {
    dispatch({ type: ORDERS_UPDATED, payload: orders ?? [] });
  }, [dispatch, orders]);
};
