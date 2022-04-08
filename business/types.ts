import { NestedNavigatorParams } from '../common/types';

export type LoggedBusinessNavParamsList = {
  BusinessPending: undefined;
  BusinessNavigator: NestedNavigatorParams<BusinessNavParamsList>;
};

export type BusinessNavParamsList = {
  BusinessOrders: undefined;
  OrderDetail: {
    orderId: string;
  };
  BusinessChats: undefined;
  ManagerOptions: undefined;
  AboutApp: undefined;
  Terms: undefined;
};
