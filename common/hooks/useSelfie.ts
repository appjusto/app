import { Flavor } from '@appjusto/types';
import { useContext } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../app/context';

export const useSelfie = (id?: string, flavor?: Flavor, size?: string) => {
  const api = useContext(ApiContext);
  return useQuery(['selfie', id], () =>
    id && flavor ? api.user().fetchSelfie(id, flavor, size) : Promise.resolve(null)
  );
};
