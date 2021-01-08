import { useContext } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../../app/context';

export default function (id?: string) {
  const api = useContext(ApiContext);
  return useQuery(['courier-selfie', id], () =>
    id ? api.courier().fetchSelfie(id) : Promise.resolve(null)
  );
}
