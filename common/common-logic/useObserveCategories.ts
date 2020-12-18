import { Category, WithId } from 'appjusto-types';
import React from 'react';

import { ApiContext } from '../app/context';

export const useObserveCategories = (restaurantId: string | undefined) => {
  // context
  const api = React.useContext(ApiContext);

  // state
  const [categories, setCategories] = React.useState<WithId<Category>[]>([]);

  // side effects
  React.useEffect(() => {
    if (!restaurantId) return;
    return api.menu().observeCategories(restaurantId, setCategories);
  }, [api, restaurantId]);

  // return
  return categories;
};
