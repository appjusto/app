import React from 'react';
import { OrderCancellation } from '../../../../../../types';
import { ApiContext } from '../../../../app/context';

export const useOrderCancellationInfo = (id: string) => {
  const api = React.useContext(ApiContext);
  const [cancellationInfo, setCancellationInfo] = React.useState<OrderCancellation>();
  React.useEffect(() => {
    if (!id) return;
    (async () => {
      setCancellationInfo(await api.order().fetchOrderCancellation(id));
    })();
  }, [id, api]);
  return cancellationInfo;
};
