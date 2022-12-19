import { CourierOrderRequest, WithId } from '@appjusto/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../../app/context';
import { getCourier } from '../../../courier/selectors';

export const useObserveOrderRequests = (orderId: string) => {
  // context
  const api = React.useContext(ApiContext);
  // redux
  const courierId = useSelector(getCourier)!.id;
  // state
  const [requests, setRequests] = React.useState<WithId<CourierOrderRequest>[]>([]);
  // side effects
  // observe pending requests
  React.useEffect(() => {
    return api.courier().observeOrderRequests(courierId, setRequests, orderId);
  }, [api, courierId, orderId]);
  // result
  return requests;
};
