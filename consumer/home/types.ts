import { Place } from 'appjusto-types';
import { ChatParamList } from '../../common/screens/Chat';
import { NestedNavigatorParams } from '../../common/types';
import { OrderNavigatorParamList } from './orders/types';
import { RestaurantsNavigatorParamList } from './restaurants/types';

export type HomeNavigatorParamList = {
  Home: undefined;
  CreateOrderP2P?: {
    orderId?: string;
    origin?: Place;
    destination?: Place;
    paymentMethodId?: string;
  };
  PermissionDeniedFeedback: {
    title: string;
    subtitle: string;
  };
  RestaurantsNavigator: NestedNavigatorParams<RestaurantsNavigatorParamList>;
  OrderNavigator: NestedNavigatorParams<OrderNavigatorParamList>;
} & ChatParamList;
