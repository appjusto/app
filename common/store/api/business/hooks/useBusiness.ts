import { Business, WithId } from 'appjusto-types';
import React from 'react';
import { ApiContext } from '../../../../app/context';

export const useBusiness = (businessId: string) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [business, setBusiness] = React.useState<WithId<Business>>();
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    return api.business().observeBusiness(businessId, setBusiness);
  }, [api, businessId]);
  // result
  return business;
};
