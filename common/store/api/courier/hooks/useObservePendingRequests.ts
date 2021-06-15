import { CourierOrderRequest } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../../../app/context';

export const useObservePendingRequests = (courierId: string) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [requests, setRequests] = React.useState<CourierOrderRequest[]>([]);
  // side effects
  // observe pending requests
  React.useEffect(() => {
    return api.courier().observePendingRequests(courierId, setRequests);
  }, [api, courierId]);
  // result
  return requests;
};
