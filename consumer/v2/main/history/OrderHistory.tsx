import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { Order, WithId } from 'appjusto-types';
import React from 'react';
import { Image, SectionList, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import * as icons from '../../../../assets/icons';
import PaddedView from '../../../../common/components/containers/PaddedView';
import ConfigItem from '../../../../common/components/views/ConfigItem';
import FeedbackView from '../../../../common/components/views/FeedbackView';
import StatusBadge from '../../../../common/components/views/StatusBadge';
import { IconMotocycle } from '../../../../common/icons/icon-motocycle';
import { useObserveOrders } from '../../../../common/store/api/order/hooks/useObserveOrders';
import {
  getOrderCreatedOn,
  getOrdersWithFilter,
  getYearsWithOrders,
  isOrderOngoing,
} from '../../../../common/store/order/selectors';
import { getUser } from '../../../../common/store/user/selectors';
import { colors, padding, screens, texts } from '../../../../common/styles';
import {
  formatAddress,
  formatDate,
  formatTime,
  separateWithDot,
} from '../../../../common/utils/formatters';
import { t } from '../../../../strings';
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
  // app state
  const user = useSelector(getUser);
  // screen state
  const options = React.useMemo(() => ({ consumerId: user?.uid }), [user?.uid]);
  const orders = useObserveOrders(options);
  const yearsWithOrders = getYearsWithOrders(orders);
  const sections = React.useMemo(() => {
    // data structure
    // [ { title: '2020', data: [ { monthName: 'Agosto', deliveries: 3, courierFee: 100 }] }]
    return yearsWithOrders.map((year) => {
      const ordersInYear = getOrdersWithFilter(orders, year);

      return {
        title: String(year),
        data: ordersInYear,
      };
    });
  }, [orders, yearsWithOrders]);

  // handlers
  const orderSelectHandler = (order: WithId<Order>) => {
    const orderId = order.id;
    const { type, status } = order;
    if (status === 'quote') {
      if (type === 'p2p') {
        navigation.navigate('P2POrderNavigator', { screen: 'CreateOrderP2P', params: { orderId } });
      } else {
        navigation.navigate('FoodOrderNavigator', {
          screen: 'RestaurantNavigator',
          initial: false,
          params: {
            restaurantId: order.business!.id,
            screen: 'RestaurantDetail',
          },
        });
      }
    } else if (status === 'confirming') {
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
    }
  };

  // UI
  if (sections.length === 0) {
    return (
      <FeedbackView
        header={t('Seu histórico está vazio')}
        description={t('Você ainda não fez nenhum pedido')}
        icon={<IconMotocycle />}
        background={colors.grey50}
      />
    );
  }
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OrderHistory"
        options={{ title: 'Seus pedidos' }}
        children={() => (
          <View style={[screens.config]}>
            <SectionList
              style={{ flex: 1 }}
              sections={sections}
              keyExtractor={(item) => item.id}
              stickySectionHeadersEnabled={false}
              renderSectionHeader={({ section }) => (
                <PaddedView
                  style={{
                    flexDirection: 'row',
                    borderBottomColor: colors.grey500,
                    borderBottomWidth: 1,
                  }}
                >
                  <Image source={icons.calendar} />
                  <Text style={{ ...texts.md, marginLeft: padding }}>{section.title}</Text>
                </PaddedView>
              )}
              renderItem={({ item }) => {
                const createdOn = getOrderCreatedOn(item);
                const title =
                  item.type === 'food'
                    ? item.business?.name ?? ''
                    : formatAddress(item.origin!.address);
                const subtitle = createdOn
                  ? separateWithDot(formatDate(createdOn), formatTime(createdOn))
                  : '';
                return (
                  <ConfigItem
                    title={title}
                    subtitle={subtitle}
                    onPress={() => orderSelectHandler(item)}
                  >
                    <StatusBadge order={item} />
                  </ConfigItem>
                );
              }}
            />
          </View>
        )}
      />
    </Stack.Navigator>
  );
}
