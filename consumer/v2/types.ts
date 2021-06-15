import { PermissionDeniedParamList } from '../../common/screens/PermissionDenied';
import { NestedNavigatorParams } from '../../common/types';
import { DeliveredOrderNavigatorParamList } from './delivered/types';
import { FoodOrderNavigatorParamList } from './food/types';
import { ProfileParamList } from './main/profile/types';
import { MainNavigatorParamList } from './main/types';
import { OngoingOrderNavigatorParamList } from './ongoing/types';
import { P2POrderNavigatorParamList } from './p2p/types';

export type LoggedNavigatorParamList = {
  ConsumerOnboarding?: {
    state?: string;
    city?: string;
  };
  RegistrationSubmitted: undefined;
  SelectLocation:
    | {
        mode: 'states';
      }
    | {
        mode: 'cities';
        state: string;
      };
  MainNavigator: NestedNavigatorParams<MainNavigatorParamList>;
  P2POrderNavigator: NestedNavigatorParams<P2POrderNavigatorParamList>;
  FoodOrderNavigator: NestedNavigatorParams<FoodOrderNavigatorParamList>;
  OngoingOrderNavigator: NestedNavigatorParams<OngoingOrderNavigatorParamList>;
  DeliveredOrderNavigator: NestedNavigatorParams<DeliveredOrderNavigatorParamList>;
  ProfileNavigator: NestedNavigatorParams<ProfileParamList>;
  OngoingOrderCancelFeedback: undefined;
} & PermissionDeniedParamList;
