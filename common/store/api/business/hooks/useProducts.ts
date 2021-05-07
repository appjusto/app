import { Product, WithId } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../../../app/context';

export const useProducts = (businessId: string) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [products, setProducts] = React.useState<WithId<Product>[]>([]);
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    return api.business().observeProducts(businessId, setProducts);
  }, [api, businessId]);
  // result
  return products;
};
