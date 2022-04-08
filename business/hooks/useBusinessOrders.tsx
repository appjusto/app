import { Order, WithId } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../common/app/context';
import { ObserveOrdersOptions } from '../../common/store/api/order/types';

export const useBusinessOrders = (businessId?: string) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[] | null>();
  const options = React.useMemo((): ObserveOrdersOptions => {
    return {
      businessId,
      orderField: 'timestamps.charged',
      statuses: ['confirmed', 'preparing', 'ready', 'dispatching', 'delivered', 'canceled'],
    };
  }, [businessId]);
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    return api.order().observeOrders(options, setOrders);
  }, [api, businessId, options]);
  return orders;
};
