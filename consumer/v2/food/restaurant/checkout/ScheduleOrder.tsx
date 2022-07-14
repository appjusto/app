import { getNextDateSlots } from '@appjusto/dates';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import { scheduleFromDate } from '../../../../../common/store/api/business/selectors';
import { padding, screens } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { LoggedNavigatorParamList } from '../../../types';
import { FoodOrderNavigatorParamList } from '../../types';
import { RestaurantNavigatorParamList } from '../types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RestaurantNavigatorParamList, 'ScheduleOrder'>,
  CompositeNavigationProp<
    StackNavigationProp<FoodOrderNavigatorParamList, 'RestaurantNavigator'>,
    StackNavigationProp<LoggedNavigatorParamList>
  >
>;
type ScreenRouteProp = RouteProp<RestaurantNavigatorParamList, 'ScheduleOrder'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const ScheduleOrder = ({ navigation, route }: Props) => {
  // params
  const { business } = route.params ?? {};

  const date = new Date();
  const fromDate = scheduleFromDate(business.schedules, date);
  const daySlots: Date[][] = getNextDateSlots(fromDate, date);
  //UI
  return (
    <ScrollView
      style={{ ...screens.default }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <View>
        <Text>Schedule Order</Text>
      </View>
      <ScrollView horizontal style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        {daySlots.map((day) => (
          <View style={{ marginRight: padding }}></View>
        ))}
      </ScrollView>
      <View style={{ flex: 1 }} />
      <View style={{ paddingBottom: padding, paddingHorizontal: padding }}>
        <DefaultButton title={t('Confirmar')} />
      </View>
    </ScrollView>
  );
};
