import { Order, WithId } from '@appjusto/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../../app/context';
import { getUser } from '../../../user/selectors';
import { ObserveOrdersOptions } from '../types';

export const useObserveOrders = (options: ObserveOrdersOptions) => {
  // context
  const api = React.useContext(ApiContext);
  // redux
  const user = useSelector(getUser);
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  // side effects
  // observe orders
  React.useEffect(() => {
    if (!user) return;
    return api.order().observeOrders(options, setOrders);
  }, [api, user]);
  // result
  return orders;
};
