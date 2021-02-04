import { useContext } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../../../../app/context';

export const useProductComplementImageURI = (businessId: string, complementId?: string) => {
  const api = useContext(ApiContext);
  return useQuery(['product', 'complement', complementId], () =>
    complementId
      ? api.business().fetchProductComplementImageURI(businessId, complementId)
      : Promise.resolve(null)
  );
};
