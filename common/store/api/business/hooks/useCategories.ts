import { Category, WithId } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../../../app/context';

export const useCategories = (businessId: string) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [categories, setCategories] = React.useState<WithId<Category>[]>([]);
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    return api.business().observeCategories(businessId, setCategories);
  }, [api, businessId]);
  // result
  return categories;
};
