import { Business, Order, OrderStatus, WithId } from '@appjusto/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../common/app/context';
import { unreadMessages } from '../common/store/api/order/hooks/useObserveOrderChat';
import { GroupedChatMessages } from '../common/store/order/types';
import { getUser } from '../common/store/user/selectors';
import { useBusinessChats } from './hooks/useBusinessChats';
import { useBusinessesManagedBy } from './hooks/useBusinessesManagedBy';
import { useCompletedBusinessOrders } from './hooks/useCompletedBusinessOrders';
import { useObserveBusinessOrders } from './hooks/useObserveBusinessOrders';
import { useConfigureBusinessNotifications } from './notifications/useConfigureBusinessNotifications';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

interface ContextProps {
  businessId: string | undefined | null;
  business: WithId<Business> | undefined;
  orders: WithId<Order>[];
  activeChats: GroupedChatMessages[][];
  completedOrdersChats: GroupedChatMessages[][];
  allChats: GroupedChatMessages[][];
  unreadCount: number;
  activeOrders: WithId<Order>[];
  completedOrders: WithId<Order>[];
  businesses: WithId<Business>[] | undefined;
  scheduledOrders: WithId<Order>[];
  selectBusinessId: (businessId: string) => void;
}

export const BusinessAppContext = React.createContext<ContextProps>({} as ContextProps);

const activeStatuses = ['confirmed', 'preparing', 'ready', 'dispatching'] as OrderStatus[];
const scheduled: OrderStatus[] = ['scheduled'];

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
  const scheduledOrders = useObserveBusinessOrders(business?.id, scheduled);
  const activeOrders = useObserveBusinessOrders(business?.id, activeStatuses);
  const completedOrders = useCompletedBusinessOrders(business?.id);
  const activeChats = useBusinessChats(business?.id, activeOrders);
  const completedOrdersChats = useBusinessChats(business?.id, completedOrders);
  const [allChats, setAllChats] = React.useState<GroupedChatMessages[][]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);

  // helpers
  const getBusinessIdFromBusinesses = React.useCallback(() => {
    if (!businesses) return;
    setBusinessId(businesses.find(() => true)?.id ?? null);
  }, [businesses]);

  const selectBusinessId = (businessId: string) => {
    setBusinessId(businessId);
  };

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
    (async () => {
      if (!user?.email) return;
      if (businessId) return;
      // checking if there is a business.id saved in AsyncStorage
      const storedBusinessId = await AsyncStorage.getItem('last-business-id');
      if (storedBusinessId) {
        setBusinessId(storedBusinessId);
      } else {
        getBusinessIdFromBusinesses();
      }
    })();
  }, [user?.email, businessId, getBusinessIdFromBusinesses]);

  React.useEffect(() => {
    setOrders([...activeOrders, ...completedOrders]);
  }, [activeOrders, completedOrders]);

  React.useEffect(() => {
    setAllChats([...activeChats, ...completedOrdersChats]);
  }, [activeChats, completedOrdersChats]);

  React.useEffect(() => {
    if (!businessId) return;
    setUnreadCount(unreadMessages(allChats.flat(), businessId).length);
  }, [businessId, allChats]);

  // provider
  return (
    <BusinessAppContext.Provider
      value={{
        businessId,
        business,
        orders,
        activeChats,
        completedOrdersChats,
        allChats,
        unreadCount,
        activeOrders,
        completedOrders,
        businesses,
        scheduledOrders,
        selectBusinessId,
      }}
    >
      {children}
    </BusinessAppContext.Provider>
  );
};

export const useBusinessContextBusiness = () => {
  return React.useContext(BusinessAppContext);
};

export const useBusinessContextBusinessId = () => {
  const { business } = useBusinessContextBusiness();
  return business?.id;
};
