import { NestedNavigatorParams } from '../../common/types';
import { DeliveredOrderNavigatorParamList } from './delivered/types';
import { FoodOrderNavigatorParamList } from './food/types';
import { ProfileParamList } from './main/profile/types';
import { MainNavigatorParamList } from './main/types';
import { OngoingOrderNavigatorParamList } from './ongoing/types';
import { P2POrderNavigatorParamList } from './p2p/types';
import { UnapprovedConsumerParamsList } from './UnapprovedConsumerNavigator';

export type LoggedNavigatorParamList = {
  ConsumerOnboarding?: {
    state?: string;
    city?: string;
  };
  SelectLocation:
    | {
        mode: 'states';
      }
    | {
        mode: 'cities';
        state: string;
      };
  Layout: undefined; // delete this after finishing the new Matching screen
  MainNavigator: NestedNavigatorParams<MainNavigatorParamList>;
  P2POrderNavigator: NestedNavigatorParams<P2POrderNavigatorParamList>;
  FoodOrderNavigator: NestedNavigatorParams<FoodOrderNavigatorParamList>;
  OngoingOrderNavigator: NestedNavigatorParams<OngoingOrderNavigatorParamList>;
  DeliveredOrderNavigator: NestedNavigatorParams<DeliveredOrderNavigatorParamList>;
  ProfileNavigator: NestedNavigatorParams<ProfileParamList>;
  OngoingOrderCancelFeedback: undefined;
  UnapprovedConsumerNavigator: UnapprovedConsumerParamsList;
};
