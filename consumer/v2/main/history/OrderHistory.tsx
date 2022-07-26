import { Dayjs, formatRelativeDate } from '@appjusto/dates';
import { Order, WithId } from '@appjusto/types';
import { MaterialIcons } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../../common/app/context';
import ConfigItem from '../../../../common/components/views/ConfigItem';
import StatusBadge from '../../../../common/components/views/StatusBadge';
import { useContextGetSeverTime } from '../../../../common/contexts/ServerTimeContext';
import { useObserveOrders } from '../../../../common/store/api/order/hooks/useObserveOrders';
import { ObserveOrdersOptions } from '../../../../common/store/api/order/types';
import { track, useSegmentScreen } from '../../../../common/store/api/track';
import { getFlavor } from '../../../../common/store/config/selectors';
import { getOrderTime, isOrderOngoing } from '../../../../common/store/order/selectors';
import { getUser } from '../../../../common/store/user/selectors';
import { colors, screens } from '../../../../common/styles';
import {
  formatAddress,
  formatDate,
  formatTime,
  separateWithDot,
} from '../../../../common/utils/formatters';
import { LoggedNavigatorParamList } from '../../types';
import { MainNavigatorParamList } from '../types';

type ScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainNavigatorParamList, 'OrderHistory'>,
  StackNavigationProp<LoggedNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<MainNavigatorParamList, 'OrderHistory'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

const Stack = createStackNavigator();
export default function ({ navigation, route }: Props) {
  // context
  const getServerTime = useContextGetSeverTime();
  const api = React.useContext(ApiContext);
  // redux
  const user = useSelector(getUser)!;
  const flavor = useSelector(getFlavor);
  // refs
  // state
  const [from, setFrom] = React.useState<Date>(Dayjs(getServerTime()).startOf('w').toDate());
  const options = React.useMemo(
    (): ObserveOrdersOptions => ({
      from,
      ...(flavor === 'consumer'
        ? { consumerId: user.uid }
        : {
            courierId: user.uid,
          }),
    }),
    [from]
  );
  const orders = useObserveOrders(options);
  // side effects
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: `${formatRelativeDate(from, getServerTime())}`,
    });
  }, [navigation, from]);
  // tracking
  useSegmentScreen('Order History by Month');
  // handlers
  const orderSelectHandler = (order: WithId<Order>) => {
    const orderId = order.id;
    const { type, status } = order;
    if (status === 'quote') {
      if (type === 'p2p') {
        track('consumer is proceeding with a p2p order that was in quote');
        navigation.navigate('P2POrderNavigator', { screen: 'CreateOrderP2P', params: { orderId } });
      } else {
        track('consumer is proceeding with a food order that was in quote');
        navigation.navigate('FoodOrderNavigator', {
          screen: 'RestaurantNavigator',
          initial: false,
          params: {
            restaurantId: order.business!.id,
            screen: 'RestaurantDetail',
          },
        });
      }
    } else if (status === 'confirming' || status === 'charged') {
      navigation.navigate('OngoingOrderNavigator', {
        screen: 'OngoingOrderConfirming',
        params: {
          orderId,
        },
      });
    } else if (isOrderOngoing(order)) {
      navigation.navigate('OngoingOrderNavigator', {
        screen: 'OngoingOrder',
        params: {
          orderId,
        },
      });
    } else if (status === 'delivered') {
      navigation.navigate('DeliveredOrderNavigator', {
        screen: 'DeliveredOrderDetail',
        params: {
          orderId,
        },
      });
    } else if (status === 'canceled') {
      navigation.navigate('DeliveredOrderNavigator', {
        screen: 'DeliveredOrderDetail',
        params: {
          orderId,
        },
      });
    }
  };
  const removeItemHandler = (orderId: string) => {
    (async () => {
      api.order().deleteOrder(orderId);
      track('deleted order in quote that was being listed in history');
    })();
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
          const time = getOrderTime(item);
          const title =
            item.type === 'food' ? item.business?.name ?? '' : formatAddress(item.origin!.address);
          const subtitle = separateWithDot(formatDate(time), formatTime(time));
          return (
            <ConfigItem
              title={title}
              subtitle={subtitle}
              onPress={() => orderSelectHandler(item)}
              leftIcon={
                item.type === 'food' ? (
                  <MaterialIcons name="fastfood" size={16} />
                ) : (
                  <MaterialIcons name="local-mall" size={16} />
                )
              }
            >
              <StatusBadge order={item} onRemove={() => removeItemHandler(item.id)} />
            </ConfigItem>
          );
        }}
      />
    </View>
  );
}
