import { useContext } from 'react';
import { useQuery } from 'react-query';

import { ApiContext } from '../../app/context';

export default function (id: string) {
  const api = useContext(ApiContext);
  const fetchSelfie = (key: string, courierId: string) => api.courier().fetchSelfie(courierId);
  return useQuery(['courier-selfie', id], fetchSelfie);
}
