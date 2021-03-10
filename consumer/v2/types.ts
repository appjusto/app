import { NestedNavigatorParams } from '../../common/types';
import { ProfileParamList } from '../profile/types';
import { OngoingOrderNavigatorParamList } from './ongoing/types';
import { P2POrderNavigatorParamList } from './p2p/types';

export type LoggedNavigatorParamList = {
  MainNavigator: undefined;
  P2POrderNavigator: NestedNavigatorParams<P2POrderNavigatorParamList>;
  FoodOrderNavigator: undefined;
  OngoingOrderNavigator: NestedNavigatorParams<OngoingOrderNavigatorParamList>;
  ProfileNavigator: NestedNavigatorParams<ProfileParamList>;
};
