import { Order, WithId } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../../../app/context';
import { ObserveOrdersOptions } from '../types';

export const useObserveOrders = (options: ObserveOrdersOptions) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>();
  // side effects
  // observe orders
  React.useEffect(() => {
    return api.order().observeOrders(options, setOrders);
  }, [api, options]);
  // result
  return orders;
};
