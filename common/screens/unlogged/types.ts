import { FoodOrderNavigatorParamList } from '../../../consumer/v2/food/types';
import { NestedNavigatorParams } from '../../types';

export type UnloggedParamList = {
  Home: undefined;
  FoodOrderNavigator: NestedNavigatorParams<FoodOrderNavigatorParamList>;
  WelcomeScreen: undefined;
  SignInFeedback: {
    email: string;
  };
  PhoneLoginScreen: {
    phone: string;
  };
  Terms: undefined;
};
