import { Order, WithId } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../common/app/context';
import { QueryOrdering } from '../../common/store/api/order';

export const useCompletedBusinessOrders = (businessId?: string, ordering?: QueryOrdering) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    const unsub = api
      .order()
      .observeBusinessOrdersCompletedInTheLastHour(setOrders, businessId, ordering);
    return () => unsub();
  }, [api, businessId, ordering]);
  // return
  return orders;
};
