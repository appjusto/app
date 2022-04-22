import { Business, WithId } from '@appjusto/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../common/app/context';
import { getUser } from '../common/store/user/selectors';
import { useBusinessesManagedBy } from './hooks/useBusinessesManagedBy';
import { useConfigureBusinessNotifications } from './notifications/useConfigureBusinessNotifications';

export const BusinessAppContext = React.createContext<WithId<Business> | null | undefined>(
  undefined
);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const BusinessAppProvider = ({ children }: Props) => {
  // context
  const api = React.useContext(ApiContext);

  // redux
  const user = useSelector(getUser);

  // state
  const businesses = useBusinessesManagedBy();
  const [businessId, setBusinessId] = React.useState<string | undefined | null>();
  const [business, setBusiness] = React.useState<WithId<Business>>();

  // helpers
  const getBusinessIdFromBusinesses = React.useCallback(() => {
    if (!businesses) return;
    setBusinessId(businesses.find(() => true)?.id ?? null);
  }, [businesses]);

  // side-effects
  // configure notifications
  useConfigureBusinessNotifications(business);
  //
  React.useEffect(() => {
    if (!user) setBusinessId(null);
  }, [user]);

  React.useEffect(() => {
    if (!businessId) return;
    return api.business().observeBusiness(businessId, setBusiness);
  }, [api, businessId]);

  React.useEffect(() => {
    if (!user?.email) return;
    if (businessId) return;
    getBusinessIdFromBusinesses();
  }, [user?.email, businessId, getBusinessIdFromBusinesses]);

  // provider
  return <BusinessAppContext.Provider value={business}>{children}</BusinessAppContext.Provider>;
};
