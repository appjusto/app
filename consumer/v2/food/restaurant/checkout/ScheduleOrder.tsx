import { getNextDateSlots } from '@appjusto/dates';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { capitalize } from 'lodash';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ApiContext } from '../../../../../common/app/context';
import CheckField from '../../../../../common/components/buttons/CheckField';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { DayBoxListItem } from '../../../../../common/components/list items/DayBoxListItem';
import { useContextGetSeverTime } from '../../../../../common/contexts/ServerTimeContext';
import { useObserveBusiness } from '../../../../../common/store/api/business/hooks/useObserveBusiness';
import { scheduleFromDate } from '../../../../../common/store/api/business/selectors';
import { useContextActiveOrder } from '../../../../../common/store/context/order';
import { colors, halfPadding, padding, screens, texts } from '../../../../../common/styles';
import { getETAWithMargin } from '../../../../../common/utils/formatters/datetime';
import { Dayjs, t } from '../../../../../strings';
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
  // context
  const getServerTime = useContextGetSeverTime();
  const order = useContextActiveOrder();
  const api = React.useContext(ApiContext);
  const now = getServerTime();
  // state
  const business = useObserveBusiness(order?.business?.id);

  if (!order) return null; // shouldn't happen
  if (!business) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  const { schedules } = business;
  const daySchedules = scheduleFromDate(schedules, now);
  const nextDateSlots: Date[][] = getNextDateSlots(daySchedules, now, 60);

  return (
    <PaddedView style={{ ...screens.default }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
        {nextDateSlots.map((day, i) => (
          <View style={{ marginRight: padding }} key={i}>
            <DayBoxListItem
              weekDay={capitalize(
                Dayjs(day[0]).calendar(now, {
                  sameDay: '[hoje]',
                  nextDay: 'dddd'.slice(0, 3),
                  nextWeek: 'dddd'.slice(0, 3),
                })
              )}
              day="hoje"
              selected
              onSelect={() => null}
            />
          </View>
        ))}
      </ScrollView>
      <View style={{ flex: 7, marginTop: 24 }}>
        <Text style={{ ...texts.md }}>{t('Entregar hoje')}</Text>
        <TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: halfPadding,
            }}
          >
            {order.arrivals?.destination?.estimate ? (
              <Text style={{ ...texts.sm, color: colors.grey700, marginTop: halfPadding }}>
                {getETAWithMargin(order.arrivals.destination.estimate)}
              </Text>
            ) : null}
            <CheckField checked={!order.scheduledTo} />
          </View>
        </TouchableOpacity>
        <View style={{ marginTop: 24 }}>
          <Text style={{ ...texts.md }}>{t('Agendamento')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}></ScrollView>
        </View>
      </View>
    </PaddedView>
  );
};
