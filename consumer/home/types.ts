import { ChatParamList } from '../../common/screens/Chat';
import { NestedNavigatorParams } from '../../common/types';
import { OrderNavigatorParamList } from './orders/types';
import { RestaurantsNavigatorParamList } from './restaurants/types';

export type HomeNavigatorParamList = {
  Home: undefined;
  PermissionDeniedFeedback: {
    title: string;
    subtitle: string;
  };
  RestaurantsNavigator: NestedNavigatorParams<RestaurantsNavigatorParamList>;
  OrderNavigator: NestedNavigatorParams<OrderNavigatorParamList>;
} & ChatParamList;
