import { LatLng } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../../../app/context';

export const useObserveOrderCourierLocation = (orderId?: string, courierId?: string) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [location, setLocation] = React.useState<LatLng | null>(null);
  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    if (!courierId) return;
    return api.order().observeOrderCourierLocation(orderId, courierId, setLocation);
  }, [api]);
  // result
  return location;
};
