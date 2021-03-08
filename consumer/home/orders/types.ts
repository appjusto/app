import { IssueType, Place } from 'appjusto-types';
import { IuguCustomerPaymentMethod } from 'appjusto-types/payment/iugu';
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
  PaymentMethodDetail: {
    paymentData: IuguCustomerPaymentMethod;
  };
  OrderConfirming: {
    orderId: string;
  };
  OrderNoMatch: {
    orderId: string;
  };
  OngoingOrder: {
    orderId: string;
    newMessage?: boolean;
  };
  CourierDetail: {
    orderId: string;
  };
  ReportIssueOngoingOrder: {
    issueType: IssueType;
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
  Home: undefined;
} & ChatParamList;
