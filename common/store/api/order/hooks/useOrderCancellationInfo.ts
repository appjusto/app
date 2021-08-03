import React from 'react';
import { OrderCancellation } from '../../../../../../types';
import { ApiContext } from '../../../../app/context';

export const useOrderCancellationInfo = (orderId: string) => {
  const api = React.useContext(ApiContext);
  const [cancellationInfo, setCancellationInfo] = React.useState<OrderCancellation>();
  React.useEffect(() => {
    if (!orderId) return;
    (async () => {
      setCancellationInfo(await api.order().fetchOrderCancellation(orderId));
    })();
  }, [orderId, api]);
  return cancellationInfo;
};
