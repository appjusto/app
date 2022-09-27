import React from 'react';
import { ApiContext } from '../../common/app/context';

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
        .fetchConsumerTotalOrdersInBusiness(businessId, consumerId, ['delivered']);
      setOrdersTotal(total);
    })();
  }, [api, businessId, consumerId]);

  return ordersTotal;
};
