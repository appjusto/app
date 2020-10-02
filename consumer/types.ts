import { NestedNavigatorParams } from '../common/types';
import { HistoryParamList } from './history/types';
import { HomeNavigatorParamList } from './home/types';
import { ProfileParamList } from './profile/types';

export type LoggedParamList = {
  HomeNavigator: NestedNavigatorParams<HomeNavigatorParamList>;
  HistoryNavigator: NestedNavigatorParams<HistoryParamList>;
  ProfileNavigator: NestedNavigatorParams<ProfileParamList>;
};
