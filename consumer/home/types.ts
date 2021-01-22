import { Place } from 'appjusto-types';
import { ChatParamList } from '../../common/screens/Chat';
import { NestedNavigatorParams } from '../../common/types';
import { RestaurantsNavigatorParamList } from './restaurants/types';

export type HomeNavigatorParamList = {
  Home: undefined;
  CreateOrderP2P?: {
    orderId?: string;
    origin?: Place;
    destination?: Place;
    paymentMethodId?: string;
  };
  AddressComplete: {
    returnScreen: 'CreateOrderP2P';
    returnParam: string;
    value?: Place;
  };
  FleetDetail: {
    fleetId: string;
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
    orderId: string;
  };
  TransportableItems: undefined;
  PermissionDeniedFeedback: {
    title: string;
    subtitle: string;
  };
  RestaurantsNavigator: NestedNavigatorParams<RestaurantsNavigatorParamList>;
} & ChatParamList;
