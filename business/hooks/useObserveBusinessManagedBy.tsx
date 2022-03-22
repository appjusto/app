import { Business, WithId } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../common/app/context';

export const useObserveBusinessManagedBy = (email: string | undefined | null) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [businesses, setBusinesses] = React.useState<WithId<Business>[]>([]);
  // side effects
  React.useEffect(() => {
    if (!email) return; // during initialization
    return api.business().observeBusinessManagedBy(email, setBusinesses);
  }, [email, api]);
  // returning the most recent business
  return businesses[0];
};
