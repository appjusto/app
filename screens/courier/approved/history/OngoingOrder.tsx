import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text } from 'react-native';

import { HistoryNavigatorParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<HistoryNavigatorParamList, 'OngoingOrder'>;
type ScreenRoute = RouteProp<HistoryNavigatorParamList, 'OngoingOrder'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export default function ({ navigation, route }: Props) {
  const { orderId } = route.params ?? {};
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Ongoing Order: {orderId}</Text>
    </View>
  );
}
