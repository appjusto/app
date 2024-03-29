import { Dayjs } from '@appjusto/dates';
import { Order, WithId } from '@appjusto/types';
import { MaterialIcons } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { capitalize } from 'lodash';
import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import FeedbackView from '../../../../common/components/views/FeedbackView';
import { IconMotocycle } from '../../../../common/icons/icon-motocycle';
import { useObserveOrders } from '../../../../common/store/api/order/hooks/useObserveOrders';
import { ObserveOrdersOptions } from '../../../../common/store/api/order/types';
import { useSegmentScreen } from '../../../../common/store/api/track';
import { isOrderOngoing } from '../../../../common/store/order/selectors';
import { getUser } from '../../../../common/store/user/selectors';
import {
  colors,
  doublePadding,
  halfPadding,
  padding,
  screens,
  texts,
} from '../../../../common/styles';
import { useServerTime } from '../../../../common/utils/platform/useServerTime';
import { t } from '../../../../strings';
import { DeliveryHistoryCard } from '../../components/DeliveryHistoryCard';
import { ApprovedParamList } from '../../types';
import { MainParamList } from '../types';
import { DeliveriesNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<DeliveriesNavigatorParamList, 'DeliveryHistoryByWeek'>,
  CompositeNavigationProp<
    BottomTabNavigationProp<MainParamList, 'DeliveryHistory'>,
    StackNavigationProp<ApprovedParamList, 'MainNavigator'>
  >
>;
type ScreenRoute = RouteProp<DeliveriesNavigatorParamList, 'DeliveryHistoryByWeek'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export const DeliveryHistoryByWeek = ({ navigation, route }: Props) => {
  // context
  const getServerTime = useServerTime();
  // redux
  const user = useSelector(getUser)!;
  // state
  const [from, setFrom] = React.useState(Dayjs(getServerTime()).startOf('w').toDate());
  const to = Dayjs(from).add(7, 'day').toDate();
  const options = React.useMemo(
    () =>
      ({
        from,
        to,
        courierId: user.uid,
      } as ObserveOrdersOptions),
    [from, user.uid]
  );
  const orders = useObserveOrders(options);
  // side effects
  // tracking
  useSegmentScreen('DeliveryHistoryByWeek');
  // handlers
  const orderPressHandler = (order: WithId<Order>) => {
    if (isOrderOngoing(order)) {
      navigation.navigate('OngoingDeliveryNavigator', {
        screen: 'OngoingDelivery',
        params: {
          orderId: order.id!,
        },
      });
    } else {
      navigation.navigate('DeliverySummary', { orderId: order.id! });
    }
  };
  // UI
  if (orders === undefined) {
    return (
      <View style={{ ...screens.centered, backgroundColor: colors.grey50 }}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  return (
    <View style={{ ...screens.config }}>
      <FlatList
        style={{ flex: 1 }}
        data={orders}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => {
          return <DeliveryHistoryCard orderId={item.id} onPress={() => orderPressHandler(item)} />;
        }}
        ListHeaderComponent={() => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding,
            }}
          >
            <TouchableOpacity
              onPress={() => setFrom((value) => Dayjs(value).subtract(7, 'day').toDate())}
            >
              <View style={{ paddingRight: padding, paddingVertical: halfPadding }}>
                <MaterialIcons name="arrow-back-ios" size={24} color="black" />
              </View>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="calendar-today" size={24} color="black" />
              <Text style={{ marginLeft: halfPadding, ...texts.md }}>{`${from.getDate()}${
                from.getMonth() !== to.getMonth()
                  ? ` de ${capitalize(Dayjs(from).format('MMMM'))}`
                  : ''
              } a ${to.getDate()} de ${capitalize(Dayjs(to).format('MMMM'))}`}</Text>
            </View>
            <TouchableOpacity
              onPress={() => setFrom((value) => Dayjs(value).add(7, 'day').toDate())}
            >
              <View style={{ paddingLeft: padding, paddingVertical: halfPadding }}>
                <MaterialIcons name="arrow-forward-ios" size={24} color="black" />
              </View>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          orders.length === 0 ? (
            <View style={{ marginTop: doublePadding }}>
              <FeedbackView
                header={t('Sem entregas no período')}
                description={t('As corridas que você efetuar aparecerão nessa lista')}
                icon={<IconMotocycle />}
                background={colors.grey50}
              />
            </View>
          ) : null
        }
      />
    </View>
  );
};
