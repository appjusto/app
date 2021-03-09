import { NestedNavigatorParams } from '../../common/types';
import { ProfileParamList } from '../profile/types';

export type LoggedNavigatorParamList = {
  MainNavigator: undefined;
  P2POrder: undefined;
  FoodOrder: undefined;
  ProfileNavigator: NestedNavigatorParams<ProfileParamList>;
};
