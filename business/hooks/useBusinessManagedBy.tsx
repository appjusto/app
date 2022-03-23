import { Business, WithId } from '@appjusto/types';
import { isEmpty } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../common/app/context';
import { getUser } from '../../common/store/user/selectors';

export const useBusinessManagedBy = (businessId?: string) => {
  // context
  const user = useSelector(getUser);
  const api = React.useContext(ApiContext);
  // state
  const [businesses, setBusinesses] = React.useState<WithId<Business>[]>();
  const [selectedBusiness, setSelectedBusiness] = React.useState<WithId<Business> | null>();
  // side effects
  React.useEffect(() => {
    (async () => {
      if (businessId) {
        setSelectedBusiness(await api.business().fetchBusinessById(businessId));
      } else {
        setBusinesses(await api.business().fetchBusinessesManagedBy(user!.email!));
      }
    })();
  }, [api, businessId]);
  React.useEffect(() => {
    if (!businesses) return;
    setSelectedBusiness(isEmpty(businesses) ? null : businesses[0]);
  }, [businesses]);
  // returning the most recent business
  return selectedBusiness;
};
