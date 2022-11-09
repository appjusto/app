import { useContext } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../app/context';

export const useDocumentImage = (id?: string, size?: string) => {
  const api = useContext(ApiContext);
  return useQuery(['consumer:document', id], () =>
    id ? api.consumer().fetchDocumentImage(id, size) : Promise.resolve(null)
  );
};
