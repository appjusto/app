import { useContext } from 'react';
import { useQuery } from 'react-query';

import { ApiContext } from '../../app/context';

export default function (id: string) {
  const api = useContext(ApiContext);
  const fetchDocumentImage = (key: string, courierId: string) =>
    api.courier().fetchDocumentImage(courierId);
  return useQuery(['courier-document', id], fetchDocumentImage);
}
