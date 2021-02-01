import { Place } from 'appjusto-types';
import { ChatParamList } from '../../../common/screens/Chat';

export type OrderNavigatorParamList = {
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
  TransportableItems: undefined;
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
  PermissionDeniedFeedback: {
    title: string;
    subtitle: string;
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
  OrderComplaint: {
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
} & ChatParamList;
