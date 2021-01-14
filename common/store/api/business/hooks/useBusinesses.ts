import { Business, WithId } from 'appjusto-types';
import React from 'react';
import { ApiContext } from '../../../../app/context';
import { ObserveBusinessOptions } from '../types';

export const useBusinesses = (options: ObserveBusinessOptions) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [businesses, setBusinesses] = React.useState<WithId<Business>[]>();
  // side effects
  React.useEffect(() => {
    return api.business().observeBusinesses(options, setBusinesses);
  }, [api, options]);
  // result
  return businesses;
};
