import { Address, Fleet, WithId } from 'appjusto-types';

import { Order, OrderCourier } from '../../../types/order';
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
    fleet: Fleet;
  };
  ProfileEdit: undefined;
  ProfileAddCard?: {
    returnScreen: 'CreateOrderP2P';
  };
  ProfilePaymentMethods?: {
    returnScreen: 'CreateOrderP2P';
  };
  OrderConfirmedFeedback: {
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
  OrderDeliveredFeedback: {
    orderId: string;
  };
  TransportableItems: undefined;
  PermissionDeniedFeedback: {
    title: string;
    subtitle: string;
  };
} & ChatParamList;
