import { OrderStatus } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../common/app/context';

const statuses = [
  'scheduled',
  'confirmed',
  'preparing',
  'ready',
  'dispatching',
  'delivered',
] as OrderStatus[];

export const useConsumerTotalOrdersInBusiness = (businessId?: string, consumerId?: string) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [ordersTotal, setOrdersTotal] = React.useState<number>();
  // side-effects
  React.useEffect(() => {
    if (!businessId) return;
    if (!consumerId) return;
    (async () => {
      const total = await api
        .business()
        .fetchConsumerTotalOrdersInBusiness(businessId, consumerId, statuses);
      setOrdersTotal(total);
    })();
  }, [api, businessId, consumerId]);

  return ordersTotal;
};
