import { GetCancellationInfoResult } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../../../app/context';

export const useGetCancellationInfo = (orderId?: string) => {
  const api = React.useContext(ApiContext);
  const [cancellationInfo, setCancellationInfo] = React.useState<GetCancellationInfoResult>();
  React.useEffect(() => {
    if (!orderId) return;
    (async () => {
      setCancellationInfo(await api.order().getCancellationInfo(orderId));
    })();
  }, [api, orderId]);
  return cancellationInfo;
};
