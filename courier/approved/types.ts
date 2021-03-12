import { PermissionDeniedParamList } from '../../common/screens/PermissionDenied';
import { NestedNavigatorParams } from '../../common/types';
import { DeliveriesNavigatorParamList } from './main/history/types';
import { CourierProfileParamList } from './main/profile/types';
import { MainParamList } from './main/types';
import { MatchingParamList } from './matching/types';
import { OngoingParamList } from './ongoing/types';

export type ApprovedParamList = {
  MainNavigator: NestedNavigatorParams<MainParamList>;
  MatchingNavigator: NestedNavigatorParams<MatchingParamList>;
  OngoingDeliveryNavigator: NestedNavigatorParams<OngoingParamList>;
  DeliveriesNavigator: NestedNavigatorParams<DeliveriesNavigatorParamList>;
  ProfileNavigator: NestedNavigatorParams<CourierProfileParamList>;
} & PermissionDeniedParamList;
