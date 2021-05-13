import { Order, WithId } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../../../app/context';

export const useObserveOrder = (orderId: string | undefined) => {
  // context
  const api = React.useContext(ApiContext);
  // app state
  const [order, setOrder] = React.useState<WithId<Order>>();
  // side effects
  // observe order
  React.useEffect(() => {
    if (!orderId) return;
    return api.order().observeOrder(orderId, setOrder);
  }, [api, orderId]);
  // result
  return order;
};
