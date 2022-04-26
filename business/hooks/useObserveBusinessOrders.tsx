import { Order, OrderStatus, WithId } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../common/app/context';
import { ObserveOrdersOptions } from '../../common/store/api/order/types';

export const useObserveBusinessOrders = (
  businessId?: string,
  statuses?: OrderStatus[] | undefined
) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  const options = React.useMemo((): ObserveOrdersOptions => {
    return {
      businessId,
      orderField: 'timestamps.charged',
      statuses,
    };
  }, [businessId, statuses]);
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    return api.order().observeOrders(options, setOrders);
  }, [api, businessId, options]);
  return orders;
};
