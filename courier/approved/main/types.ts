import { NestedNavigatorParams } from '../../../common/types';
import { DeliveriesNavigatorParamList } from './history/types';
import { HomeParamList } from './home/types';
import { CourierProfileParamList } from './profile/types';

export type MainParamList = {
  HomeNavigator: NestedNavigatorParams<HomeParamList>;
  DeliveriesNavigator: NestedNavigatorParams<DeliveriesNavigatorParamList>;
  ProfileNavigator: NestedNavigatorParams<CourierProfileParamList>;
};
