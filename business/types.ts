import { Flavor } from '@appjusto/types';
import { NestedNavigatorParams } from '../common/types';

export type LoggedBusinessNavParamsList = {
  BusinessNavigator: NestedNavigatorParams<BusinessNavParamsList>;
};

export type BusinessNavParamsList = {
  BusinessPending: undefined;
  BusinessOrders?: {
    businessId?: string;
  };
  OrderDetail: {
    orderId: string;
  };
  BusinessChats: undefined;
  BusinessOptions: undefined;
  AboutApp: undefined;
  SelectBusiness?: {
    businessId?: string;
  };
  Terms: undefined;
  OrderChat: {
    orderId: string;
    counterpartId: string;
    counterpartFlavor: Flavor;
  };
  BusinessProfile: undefined;
  NotificationPreferences: undefined;
};

export type UnnaprovedBusinessParamsList = {
  BusinessPending: undefined;
};
