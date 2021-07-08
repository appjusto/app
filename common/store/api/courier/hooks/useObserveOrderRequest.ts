import { CourierOrderRequest } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../../../app/context';

export const useObserveOrderRequest = (courierId: string, orderId: string) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [request, setRequest] = React.useState<CourierOrderRequest>();
  // side effects
  // observe request
  React.useEffect(() => {
    return api.courier().observeOrderRequest(courierId, orderId, setRequest);
  }, [api, courierId, orderId]);
  // result
  return request;
};
