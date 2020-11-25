import { Address, Fleet, Order, WithId } from 'appjusto-types';

import { ChatParamList } from '../../common/screens/Chat';

export type HomeNavigatorParamList = {
  Home: undefined;
  CreateOrderP2P?: {
    orderId?: string;
    origin?: Address;
    destination?: Address;
    paymentMethodId?: string;
  };
  AddressComplete: {
    value?: string;
    returnScreen: 'CreateOrderP2P';
    returnParam: string;
  };
  FleetDetail: {
    fleet: WithId<Fleet>;
  };
  ProfileEdit: undefined;
  ProfileAddCard?: {
    returnScreen: 'CreateOrderP2P';
  };
  ProfilePaymentMethods?: {
    returnScreen: 'CreateOrderP2P';
  };
  OrderMatching: {
    orderId: string;
  };
  OrderUnmatched: {
    orderId: string;
  };
  OngoingOrder: {
    orderId: string;
    newMessage?: boolean;
  };
  CourierDetail: {
    orderId: string;
    fleet: WithId<Fleet>;
  };
  ConfirmCancelOrder: {
    orderId: string;
  };
  CancelOrder: {
    orderId: string;
  };
  OrderDeliveredFeedback: {
    orderId: string;
  };
  OrderComplaint: {
    order: WithId<Order>;
  };
  TransportableItems: undefined;
  PermissionDeniedFeedback: {
    title: string;
    subtitle: string;
  };
  RestaurantsHome: undefined;
  RestaurantDetail: undefined;
  ItemDetail: undefined;
  RestaurantSearch: undefined;
  OrderBy: undefined;
} & ChatParamList;
