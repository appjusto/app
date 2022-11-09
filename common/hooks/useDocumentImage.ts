import { Flavor } from '@appjusto/types';
import { useContext } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../app/context';

export const useDocumentImage = (id?: string, flavor?: Flavor, size?: string) => {
  const api = useContext(ApiContext);
  return useQuery(['document', id], () =>
    id && flavor ? api.user().fetchDocumentImage(id, flavor, size) : Promise.resolve(null)
  );
};
