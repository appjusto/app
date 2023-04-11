import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../../app/context';

export const useProductImageURI = (businessId: string, productId?: string, size?: string) => {
  const api = useContext(ApiContext);
  return useQuery(['product', 'image', productId], () =>
    productId
      ? api.business().fetchProductImageURI(businessId, productId, size)
      : Promise.resolve(null)
  );
};
