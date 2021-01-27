import { Product, WithId } from 'appjusto-types';
import React from 'react';
import { ApiContext } from '../../../../app/context';

export const useProduct = (businessId: string, productId: string) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [product, setProduct] = React.useState<WithId<Product>>();
  // side effects
  React.useEffect(() => {
    return api.business().observeProduct(businessId, productId, setProduct);
  }, [api, businessId]);
  // result
  return product;
};
