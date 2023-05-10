import { FoodOrderNavigatorParamList } from '../../../consumer/v2/food/types';
import { NestedNavigatorParams } from '../../types';

export type UnloggedParamList = {
  Home: undefined;
  FoodOrderNavigator: NestedNavigatorParams<FoodOrderNavigatorParamList>;
  WelcomeScreen: undefined;
  PhoneLoginScreen: {
    phone: string;
    countryCode: string;
  };
  Terms: undefined;
};
