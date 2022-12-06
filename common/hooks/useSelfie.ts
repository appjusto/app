import { useContext } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../app/context';

export const useSelfie = (id?: string, size?: string) => {
  const api = useContext(ApiContext);
  return useQuery(['consumer:selfie', id], () =>
    id ? api.consumer().fetchSelfie(id, size) : Promise.resolve(null)
  );
};
