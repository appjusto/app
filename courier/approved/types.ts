import { NestedNavigatorParams } from '../../common/types';
import { MainParamList } from './main/types';
import { MatchingParamList } from './matching/types';
import { OngoingParamList } from './ongoing/types';

export type ApprovedParamList = {
  MainNavigator: NestedNavigatorParams<MainParamList>;
  MatchingNavigator: NestedNavigatorParams<MatchingParamList>;
  OngoingNavigator: NestedNavigatorParams<OngoingParamList>;
};
