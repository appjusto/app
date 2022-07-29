import { getNextDateSlots } from '@appjusto/dates';
import { PreparationMode } from '@appjusto/types';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Timestamp } from 'firebase/firestore';
import { capitalize } from 'lodash';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../../common/app/context';
import CheckField from '../../../../../common/components/buttons/CheckField';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import { DayBoxListItem } from '../../../../../common/components/list items/DayBoxListItem';
import { useContextGetSeverTime } from '../../../../../common/contexts/ServerTimeContext';
import { useObserveBusiness } from '../../../../../common/store/api/business/hooks/useObserveBusiness';
import { scheduleFromDate } from '../../../../../common/store/api/business/selectors';
import { useContextActiveOrder } from '../../../../../common/store/context/order';
import { showToast } from '../../../../../common/store/ui/actions';
import {
  borders,
  colors,
  doublePadding,
  halfPadding,
  padding,
  screens,
  texts,
} from '../../../../../common/styles';
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
  // const now = new Date('2022-07-29T20:00:00');
  const business = useObserveBusiness(order?.business?.id);
  const dispatch = useDispatch<AppDispatch>();

  // state
  const [selectedDay, setSelectedDay] = React.useState<Date[]>();
  const [selectedSlot, setSelectedSlot] = React.useState<Timestamp | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [prepMode, setPrepMode] = React.useState<PreparationMode | undefined>();

  // helpers
  const margin = 60;
  const daySchedules = business?.schedules ? scheduleFromDate(business.schedules, now) : [];
  const nextDateSlots: Date[][] = getNextDateSlots(daySchedules, now, margin);
  const realTimeDelivery =
    business?.status === 'open' && business?.preparationModes?.includes('realtime');

  //side effects
  // loading the first Date[] with slots as selectedDay
  // using business.id as a dependency because it will only change in the first render,
  // when business turns from undefined to true. order.id is also used because we need to check
  // if there is an order.scheduledTo.
  // also setting prepMode after the business is loaded
  React.useEffect(() => {
    if (business && order) {
      const firsDayWithSlots = nextDateSlots?.find((slot) => slot.length > 0);
      if (firsDayWithSlots?.length) setSelectedDay(firsDayWithSlots);
      else setSelectedDay(nextDateSlots[0]);
      if (order?.scheduledTo) {
        const dayScheduled = nextDateSlots.find(
          (slot) => slot[0].getDate() === (order.scheduledTo as Timestamp).toDate().getDate()
        );
        setPrepMode('scheduled');
        setSelectedSlot(order.scheduledTo as Timestamp);
        if (dayScheduled?.length) setSelectedDay(dayScheduled);
        else setSelectedDay([]);
      } else setPrepMode(realTimeDelivery ? 'realtime' : undefined);
    }
  }, [business?.id, order?.id]);

  // UI
  if (!order) return null; // shouldn't happen
  if (!business || selectedDay === undefined) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  // handler
  const confirmSlotHandler = async () => {
    try {
      setLoading(true);
      await api.order().updateOrder(order?.id, { scheduledTo: selectedSlot });
      setLoading(false);
      navigation.navigate('FoodOrderCheckout');
    } catch (error: any) {
      setLoading(false);
      dispatch(showToast(error.toString(), 'error'));
    }
  };

  return (
    <View style={{ ...screens.default, padding }}>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {nextDateSlots.map((day, i) => {
            return day.length ? (
              <View style={{ marginRight: padding }} key={i}>
                <DayBoxListItem
                  weekDay={
                    day.length
                      ? capitalize(
                          Dayjs(day[0]).calendar(now, {
                            sameDay: '[hoje]',
                            nextDay: 'dddd'.slice(0, 3),
                            nextWeek: 'dddd'.slice(0, 3),
                          })
                        )
                      : ''
                  }
                  day={day.length ? day[0].getDate().toString() : ''}
                  selected={
                    Boolean(day) &&
                    Boolean(selectedDay) &&
                    day.toString() === selectedDay?.toString()
                  }
                  onSelect={() => setSelectedDay(day)}
                />
              </View>
            ) : null;
          })}
        </ScrollView>
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 24 }}
          ListHeaderComponent={
            <View>
              {realTimeDelivery ? (
                <View style={{ marginBottom: doublePadding }}>
                  <Text style={{ ...texts.md }}>{t('Entregar hoje')}</Text>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setSelectedSlot(null);
                      setPrepMode('realtime');
                      setSelectedDay(nextDateSlots[0]);
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: halfPadding,
                      }}
                    >
                      {order.arrivals?.destination?.estimate ? (
                        <Text
                          style={{ ...texts.sm, color: colors.grey700, marginTop: halfPadding }}
                        >
                          {getETAWithMargin(order.arrivals.destination.estimate)}
                        </Text>
                      ) : null}
                      <CheckField
                        checked={selectedSlot === null && prepMode === 'realtime'}
                        variant="circle"
                        onPress={() => {
                          setSelectedSlot(null);
                          setPrepMode('realtime');
                          setSelectedDay(nextDateSlots[0]);
                        }}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              ) : null}
              {Boolean(selectedDay) && selectedDay?.length ? (
                <Text style={{ ...texts.md, marginBottom: padding }}>{t('Agendar')}</Text>
              ) : null}
            </View>
          }
          data={selectedDay}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item, index }) => (
            <TouchableWithoutFeedback
              onPress={() => {
                setPrepMode('scheduled');
                setSelectedSlot(Timestamp.fromDate(item));
              }}
              style={{ paddingVertical: 2, ...borders.default }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: index !== 0 ? padding : 0,
                }}
              >
                <Text style={{ ...texts.sm, color: colors.grey700, marginTop: halfPadding }}>
                  {getETAWithMargin(item, margin)}
                </Text>
                <CheckField
                  checked={Boolean(selectedSlot) && Timestamp.fromDate(item).isEqual(selectedSlot!)}
                  variant="circle"
                  onPress={() => {
                    setPrepMode('scheduled');
                    setSelectedSlot(Timestamp.fromDate(item));
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          )}
        />
        {Boolean(selectedDay) && selectedDay?.length ? (
          <View style={{ marginTop: padding }}>
            <DefaultButton
              title={t('Confirmar')}
              onPress={confirmSlotHandler}
              activityIndicator={loading}
              disabled={prepMode === 'scheduled' && !selectedSlot}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
};
