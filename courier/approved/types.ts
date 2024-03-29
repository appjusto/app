import { IssueType, Place } from '@appjusto/types';
import { PermissionDeniedParamList } from '../../common/screens/PermissionDenied';
import { NestedNavigatorParams } from '../../common/types';
import { AddressCompleteParamList } from '../../consumer/v2/common/AddressComplete';
import { DeliveriesNavigatorParamList } from './main/history/types';
import { HowAppJustoWorksParams } from './main/howitworks/types';
import { PaymentNavigatorParamList } from './main/payment/types';
import { CourierProfileParamList } from './main/profile/types';
import { MainParamList } from './main/types';
import { MatchingParamList } from './matching/types';
import { OngoingDeliveryNavigatorParamList } from './ongoing/types';

export type ApprovedParamList = {
  MainNavigator: NestedNavigatorParams<MainParamList>;
  MatchingNavigator: NestedNavigatorParams<MatchingParamList>;
  OngoingDeliveryNavigator: NestedNavigatorParams<OngoingDeliveryNavigatorParamList>;
  DeliveriesNavigator: NestedNavigatorParams<DeliveriesNavigatorParamList>;
  ProfileNavigator: NestedNavigatorParams<CourierProfileParamList>;
  PaymentNavigator: NestedNavigatorParams<PaymentNavigatorParamList>;
  DeliveryProblemFeedback: {
    issueType: IssueType;
    orderId: string;
  };
  DropOrderFeedback: undefined;
  RejectedMatchingFeedback: undefined;
  HowAppJustoWorksNavigator: NestedNavigatorParams<HowAppJustoWorksParams>;
  ComplaintScreen?: {
    orderId: string;
  };
  ComplaintFeedbackScreen: undefined;
  RecommendRestaurant?: {
    place?: Place;
    returnToHome?: boolean;
  };
  RecommendationFeedback?: {
    returnToHome?: boolean;
  };
} & PermissionDeniedParamList &
  AddressCompleteParamList;
