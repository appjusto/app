import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../../app/context';

export default function (id?: string, size?: string) {
  const api = useContext(ApiContext);
  return useQuery(['courier-selfie', id], () =>
    id ? api.courier().fetchSelfie(id, size) : Promise.resolve(null)
  );
}
