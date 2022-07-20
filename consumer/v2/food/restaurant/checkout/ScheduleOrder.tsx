import { getNextDateSlots } from '@appjusto/dates';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Timestamp } from 'firebase/firestore';
import { capitalize } from 'lodash';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ApiContext } from '../../../../../common/app/context';
import CheckField from '../../../../../common/components/buttons/CheckField';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
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
  const business = useObserveBusiness(order?.business?.id);
  // state
  const [selectedDay, setSelectedDay] = React.useState<Date[]>();
  const [selectedSlot, setSelectedSlot] = React.useState<Timestamp>();
  const [loading, setLoading] = React.useState(false);

  if (!order) return null; // shouldn't happen
  if (!business) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  const { schedules, status, preparationModes } = business;
  const realTimeDelivery = status === 'open' && preparationModes?.includes('realtime');
  const daySchedules = scheduleFromDate(schedules, now);
  const nextDateSlots: Date[][] = realTimeDelivery
    ? getNextDateSlots(daySchedules, now, 60)
    : getNextDateSlots(daySchedules, now, 60).slice(1);
  return (
    <View style={{ ...screens.default, padding }}>
      <View style={{ flex: 0.5 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 0.5 }}>
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
                day={capitalize(
                  Dayjs(day[0]).calendar(now, {
                    sameDay: '[hoje]',
                    nextDay: 'dddd'.slice(0, 3),
                    nextWeek: 'dddd'.slice(0, 3),
                  })
                )}
                selected={
                  selectedDay !== undefined &&
                  Timestamp.fromDate(day[0]).isEqual(Timestamp.fromDate(selectedDay[0]))
                }
                onSelect={() => setSelectedDay(day)}
              />
            </View>
          ))}
        </ScrollView>
      </View>
      {realTimeDelivery ? (
        <View style={{ flex: 0.5 }}>
          <Text style={{ ...texts.md }}>{t('Entregar hoje')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('FoodOrderCheckout')}>
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
        </View>
      ) : null}
      <View
        style={{
          flex: 1,

          marginBottom: halfPadding,
          paddingBottom: 24,
        }}
      >
        {selectedDay && selectedDay.length > 0 ? (
          <View style={{ flex: 1 }}>
            <Text style={{ ...texts.md, marginBottom: padding }}>{t('Agendamento')}</Text>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ flexGrow: 1, flex: 1, paddingBottom: 32 }}
            >
              {selectedDay?.map((slot, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    setLoading(true);
                    api.order().updateOrder(order.id, { scheduledTo: Timestamp.fromDate(slot) });
                    setLoading(false);
                    setSelectedSlot(Timestamp.fromDate(slot));
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: i !== 0 ? padding : 0,
                    }}
                  >
                    <Text style={{ ...texts.sm, color: colors.grey700, marginTop: halfPadding }}>
                      {getETAWithMargin(slot)}
                    </Text>
                    <CheckField
                      checked={
                        selectedSlot !== undefined && Timestamp.fromDate(slot).isEqual(selectedSlot)
                      }
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : (
          <View style={{ flex: 1 }} />
        )}
      </View>
      <DefaultButton
        title={t('Confirmar')}
        onPress={() => navigation.navigate('FoodOrderCheckout')}
        activityIndicator={loading}
      />
    </View>
  );
};
