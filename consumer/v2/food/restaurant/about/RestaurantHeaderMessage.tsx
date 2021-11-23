import { CompositeNavigationProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { UnloggedParamList } from '../../../../../common/screens/unlogged/types';
import { useBusinessMenuMessage } from '../../../../../common/store/api/business/hooks/useBusinessMenuMessage';
import { useContextBusiness } from '../../../../../common/store/context/business';
import { colors, screens, texts } from '../../../../../common/styles';
import { LoggedNavigatorParamList } from '../../../types';
import { FoodOrderNavigatorParamList } from '../../types';
import { RestaurantNavigatorParamList } from '../types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RestaurantNavigatorParamList, 'RestaurantHeaderMessage'>,
  CompositeNavigationProp<
    StackNavigationProp<FoodOrderNavigatorParamList, 'RestaurantNavigator'>,
    StackNavigationProp<LoggedNavigatorParamList & UnloggedParamList>
  >
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export const RestaurantHeaderMessage = ({ navigation }: Props) => {
  // context
  const restaurant = useContextBusiness();
  const message = useBusinessMenuMessage(restaurant!.id);
  // side effects
  // setting the restaurant.name in the header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: restaurant?.name ?? '',
    });
  }, [navigation, restaurant]);
  //UI
  if (!restaurant || !message)
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  return (
    <PaddedView style={{ ...screens.default }}>
      <Text style={{ ...texts.xl }}>{message.title}</Text>
      <Text style={{ ...texts.sm, color: colors.grey700, paddingTop: 4 }}>
        {message.description}
      </Text>
    </PaddedView>
  );
};
