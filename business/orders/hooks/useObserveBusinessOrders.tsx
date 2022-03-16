import { Order, WithId } from '@appjusto/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../common/app/context';
import { ObserveBusinessOrdersOptions } from '../../../common/store/api/order/types';
import { getUser } from '../../../common/store/user/selectors';

export const useObserveBusinessOrders = (options: ObserveBusinessOrdersOptions) => {
  // context
  const api = React.useContext(ApiContext);
  // redux
  const user = useSelector(getUser);
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>();
  // side effects
  // observe orders
  React.useEffect(() => {
    if (!user) return;
    return api.order().observeBusinessOrders(options, setOrders);
  }, [api, user, options]);
  // result
  return orders;
};
