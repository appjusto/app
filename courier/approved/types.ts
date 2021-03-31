import { PermissionDeniedParamList } from '../../common/screens/PermissionDenied';
import { NestedNavigatorParams } from '../../common/types';
import { DeliveriesNavigatorParamList } from './main/history/types';
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
} & PermissionDeniedParamList;
