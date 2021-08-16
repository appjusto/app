import { Ordering } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../../../app/context';

export const useObserveMenuOrdering = (businessId: string, menuId?: string) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [ordering, setOrdering] = React.useState<Ordering>();
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    return api.business().observeMenuOrdering(businessId, setOrdering, menuId);
  }, [api, businessId]);
  // result
  return ordering;
};
