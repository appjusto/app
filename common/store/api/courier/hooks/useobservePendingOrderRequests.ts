import { CourierOrderRequest } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../../../app/context';

export const useobservePendingOrderRequests = (courierId: string) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [requests, setRequests] = React.useState<CourierOrderRequest[]>([]);
  // side effects
  // observe pending requests
  React.useEffect(() => {
    return api.courier().observePendingOrderRequests(courierId, setRequests);
  }, [api, courierId]);
  // result
  return requests;
};
