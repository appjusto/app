import { Business, Order, OrderStatus, WithId } from '@appjusto/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../common/app/context';
import { getUser } from '../common/store/user/selectors';
import { useBusinessesManagedBy } from './hooks/useBusinessesManagedBy';
import { useCompletedBusinessOrders } from './hooks/useCompletedBusinessOrders';
import { useObserveBusinessOrders } from './hooks/useObserveBusinessOrders';
import { useConfigureBusinessNotifications } from './notifications/useConfigureBusinessNotifications';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

interface ContextProps {
  business: WithId<Business> | undefined;
  orders: WithId<Order>[];
}

export const BusinessAppContext = React.createContext<ContextProps>({} as ContextProps);

const activeStatuses = ['confirmed', 'preparing', 'ready', 'dispatching'] as OrderStatus[];

export const BusinessAppProvider = ({ children }: Props) => {
  // context
  const api = React.useContext(ApiContext);

  // redux
  const user = useSelector(getUser);

  // state
  const businesses = useBusinessesManagedBy();
  const [businessId, setBusinessId] = React.useState<string | undefined | null>();
  const [business, setBusiness] = React.useState<WithId<Business>>();
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  const activeOrders = useObserveBusinessOrders(business?.id, activeStatuses);
  const completedOrders = useCompletedBusinessOrders(business?.id);

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

  React.useEffect(() => {
    setOrders([...activeOrders, ...completedOrders]);
  }, [activeOrders, completedOrders]);

  // provider
  return (
    <BusinessAppContext.Provider value={{ business, orders }}>
      {children}
    </BusinessAppContext.Provider>
  );
};
