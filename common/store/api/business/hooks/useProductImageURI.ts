import { useContext } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../../../../app/context';

export const useProductImageURI = (businessId: string, productId?: string) => {
  const api = useContext(ApiContext);
  return useQuery(['product', 'image', productId], () =>
    productId ? api.business().fetchProductImageURI(businessId, productId) : Promise.resolve(null)
  );
};
