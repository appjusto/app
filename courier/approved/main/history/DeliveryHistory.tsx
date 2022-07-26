import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { useSegmentScreen } from '../../../../common/store/api/track';
import { ApprovedParamList } from '../../types';
import { MainParamList } from '../types';
import { MarketplaceAccountInfo } from './MarketplaceAccountInfo';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MainParamList, 'DeliveryHistory'>,
  StackNavigationProp<ApprovedParamList>
>;
type ScreenRoute = RouteProp<MainParamList, 'DeliveryHistory'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

// const Stack = createStackNavigator();
export default function ({ navigation, route }: Props) {
  // tracking
  useSegmentScreen('DeliveryHistory');
  // UI
  // return (
  //   <Stack.Navigator screenOptions={defaultScreenOptions}>
  //     <Stack.Screen
  //       name="DeliveryHistory"
  //       options={{ title: 'Suas corridas' }}
  //       children={() => <MarketplaceAccountInfo />}
  //     />
  //   </Stack.Navigator>
  // );
  return <MarketplaceAccountInfo />;
}
