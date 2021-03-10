import { NestedNavigatorParams } from '../../common/types';
import { ProfileParamList } from '../profile/types';
import { DeliveredOrderNavigatorParamList } from './delivered/types';
import { FoodOrderNavigatorParamList } from './food/types';
import { MainNavigatorParamList } from './main/types';
import { OngoingOrderNavigatorParamList } from './ongoing/types';
import { P2POrderNavigatorParamList } from './p2p/types';

export type LoggedNavigatorParamList = {
  MainNavigator: NestedNavigatorParams<MainNavigatorParamList>;
  P2POrderNavigator: NestedNavigatorParams<P2POrderNavigatorParamList>;
  FoodOrderNavigator: NestedNavigatorParams<FoodOrderNavigatorParamList>;
  OngoingOrderNavigator: NestedNavigatorParams<OngoingOrderNavigatorParamList>;
  DeliveredOrderNavigator: NestedNavigatorParams<DeliveredOrderNavigatorParamList>;
  ProfileNavigator: NestedNavigatorParams<ProfileParamList>;
  PermissionDeniedFeedback: {
    title: string;
    subtitle: string;
  };
};
