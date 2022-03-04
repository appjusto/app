import { useContext } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../../../../app/context';

export default function (id: string, size?: string) {
  const api = useContext(ApiContext);
  return useQuery(['courier-document', id], () =>
    id ? api.courier().fetchDocumentImage(id, size) : Promise.resolve(null)
  );
}
