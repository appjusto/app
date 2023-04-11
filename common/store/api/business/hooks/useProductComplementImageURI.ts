import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../../app/context';

export const useProductComplementImageURI = (businessId: string, complementId?: string) => {
  const api = useContext(ApiContext);
  return useQuery(['product', 'complement', complementId], () =>
    complementId
      ? api.business().fetchProductComplementImageURI(businessId, complementId)
      : Promise.resolve(null)
  );
};
