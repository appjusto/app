import { Flavor } from '@appjusto/types';
import { NestedNavigatorParams } from '../common/types';

export type LoggedBusinessNavParamsList = {
  BusinessPending: undefined;
  BusinessNavigator: NestedNavigatorParams<BusinessNavParamsList>;
};

export type BusinessNavParamsList = {
  BusinessPending: undefined;
  BusinessOrders: undefined;
  OrderDetail: {
    orderId: string;
  };
  BusinessChats: undefined;
  BusinessOptions: undefined;
  AboutApp: undefined;
  Terms: undefined;
  OrderChat: {
    orderId: string;
    counterpartId: string;
    counterpartFlavor: Flavor;
  };
  BusinessProfile: undefined;
};
