import { Place } from 'appjusto-types';
import { ChatParamList } from '../../common/screens/Chat';
import { NestedNavigatorParams } from '../../common/types';
import { OrderNavigatorParamList } from './orders/types';
import { RestaurantsNavigatorParamList } from './restaurants/types';

export type HomeNavigatorParamList = {
  Home: undefined;
  CreateOrderP2P?: {
    orderId?: string;
    origin?: Place;
    destination?: Place;
    paymentMethodId?: string;
  }; // remove
  AddressComplete: {
    returnScreen: 'CreateOrderP2P';
    returnParam: string;
    value?: Place;
  }; //remove
  FleetDetail: {
    fleetId: string;
  }; //remove
  ProfileEdit: undefined; //remove
  ProfileAddCard?: {
    returnScreen: 'CreateOrderP2P';
  }; //remove
  ProfilePaymentMethods?: {
    returnScreen: 'CreateOrderP2P';
  }; //remove
  OrderMatching: {
    orderId: string;
  }; //remove
  OrderUnmatched: {
    orderId: string;
  }; //remove
  OngoingOrder: {
    orderId: string;
    newMessage?: boolean;
  }; //remove
  CourierDetail: {
    orderId: string;
  }; //remove
  ConfirmCancelOrder: {
    orderId: string;
  }; //remove
  CancelOrder: {
    orderId: string;
  }; //remove
  OrderDeliveredFeedback: {
    orderId: string;
  }; //remove
  OrderComplaint: {
    orderId: string;
  }; //remove
  TransportableItems: undefined; //remove
  PermissionDeniedFeedback: {
    title: string;
    subtitle: string;
  }; //remove
  RestaurantsNavigator: NestedNavigatorParams<RestaurantsNavigatorParamList>;
  OrderNavigator: NestedNavigatorParams<OrderNavigatorParamList>;
} & ChatParamList;
