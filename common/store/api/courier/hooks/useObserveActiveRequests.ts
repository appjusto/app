import { CourierOrderRequest, WithId } from '@appjusto/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../../app/context';
import { getCourier } from '../../../courier/selectors';

export const useObserveActiveRequests = () => {
  // context
  const api = React.useContext(ApiContext);
  // redux
  const courierId = useSelector(getCourier)!.id;
  // state
  const [requests, setRequests] = React.useState<WithId<CourierOrderRequest>[]>([]);
  // side effects
  // observe pending requests
  React.useEffect(() => {
    return api.courier().observeActiveRequests(courierId, setRequests);
  }, [api, courierId]);
  // result
  return requests;
};
