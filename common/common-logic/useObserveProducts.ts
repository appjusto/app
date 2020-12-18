import { Product, WithId } from 'appjusto-types';
import React from 'react';

import { ApiContext } from '../app/context';

export const useObserveProducts = (restaurantId: string | undefined) => {
  // context
  const api = React.useContext(ApiContext);

  // state
  const [products, setProducts] = React.useState<WithId<Product>[]>([]);

  // side effects
  React.useEffect(() => {
    if (!restaurantId) return;
    return api.menu().observeProducts(restaurantId, setProducts);
  }, [api, restaurantId]);

  // return
  return products;
};
