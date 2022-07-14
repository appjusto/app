import { formatScheduleHour, getNextDateSlots } from '@appjusto/dates';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import CheckField from '../../../../../common/components/buttons/CheckField';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import { DayBoxListItem } from '../../../../../common/components/list items/DayBoxListItem';
import { scheduleFromDate } from '../../../../../common/store/api/business/selectors';
import { colors, padding, screens, texts } from '../../../../../common/styles';
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
  //helpers
  const date = new Date();
  const fromDate = scheduleFromDate(business.schedules, date);
  const allSlots: Date[][] = getNextDateSlots(fromDate, date);

  return (
    <View style={{ ...screens.default, padding }}>
      <ScrollView horizontal style={{ flex: 1 }} showsHorizontalScrollIndicator={false}>
        {allSlots.map((day, i) => (
          <View style={{ marginRight: padding }} key={i}>
            <DayBoxListItem weekDay="hoje" day="hoje" selected onSelect={() => null} />
          </View>
        ))}
      </ScrollView>
      <View style={{ flex: 6 }}>
        <Text style={{ ...texts.md }}>{t('Entregar hoje')}</Text>
        <TouchableOpacity>
          <View
            style={{
              marginTop: padding,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ ...texts.sm, color: colors.grey700 }}>{formatScheduleHour(date)}</Text>
            <CheckField />
          </View>
        </TouchableOpacity>
        <Text style={{ marginTop: 24, ...texts.md }}>{t('Agendamento')}</Text>
        {/* <ScrollView scrollIndicatorInsets={{ right: 0 }}></ScrollView> */}
        <View style={{ flex: 1 }} />
        <View>
          <DefaultButton title={t('Confirmar')} />
        </View>
      </View>
    </View>
  );
};
