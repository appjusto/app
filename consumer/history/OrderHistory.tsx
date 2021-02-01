import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Order, WithId } from 'appjusto-types';
import React, { useCallback, useMemo } from 'react';
import { Image, SectionList, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import * as icons from '../../assets/icons';
import PaddedView from '../../common/components/containers/PaddedView';
import ConfigItem from '../../common/components/views/ConfigItem';
import FeedbackView from '../../common/components/views/FeedbackView';
import StatusBadge from '../../common/components/views/StatusBadge';
import useObserveOrders from '../../common/store/api/order/hooks/useObserveOrders';
import {
  getOrderCreatedOn,
  getOrdersWithFilter,
  getYearsWithOrders,
} from '../../common/store/order/selectors';
import { getUser } from '../../common/store/user/selectors';
import { colors, padding, screens, texts } from '../../common/styles';
import {
  formatAddress,
  formatDate,
  formatTime,
  separateWithDot,
} from '../../common/utils/formatters';
import { t } from '../../strings';
import { HomeNavigatorParamList } from '../home/types';
import { HistoryParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HistoryParamList, 'OrderHistory'>,
  BottomTabNavigationProp<HomeNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<HistoryParamList, 'OrderHistory'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // app state
  const user = useSelector(getUser);
  // screen state
  const options = React.useMemo(() => ({ consumerId: user?.uid }), [user?.uid]);
  const orders = useObserveOrders(options);
  const yearsWithOrders = getYearsWithOrders(orders);
  const sections = useMemo(() => {
    // data structure
    // [ { title: '2020', data: [ { monthName: 'Agosto', deliveries: 3, courierFee: 100 }] }]
    return yearsWithOrders.map((year) => {
      const ordersInYear = getOrdersWithFilter(orders, year);

      return {
        title: String(year),
        data: ordersInYear,
      };
    });
  }, [yearsWithOrders]);

  // handlers
  const orderSelectHandler = useCallback((order: WithId<Order>) => {
    if (order.status === 'quote') {
      if (order.type === 'p2p') {
        navigation.navigate('CreateOrderP2P', { orderId: order.id });
      } else {
        navigation.navigate('RestaurantsNavigator', {
          screen: 'RestaurantNavigator',
          initial: false,
          params: {
            restaurantId: order.business!.id,
            screen: 'RestaurantDetail',
          },
        });
      }
    } else if (order.status === 'dispatching') {
      navigation.navigate('OngoingOrder', {
        orderId: order.id,
      });
    } else if (order.status === 'delivered') {
      navigation.navigate('OrderDetail', {
        orderId: order.id,
      });
    } else if (order.status === 'confirming') {
      navigation.navigate('OrderMatching', {
        orderId: order.id,
      });
    }
  }, []);

  // UI
  if (sections.length === 0) {
    return (
      <FeedbackView
        header={t('Seu histórico está vazio')}
        description={t('Você ainda não fez nenhum pedido')}
        icon={icons.motocycle}
        background={colors.lightGrey}
      />
    );
  }
  return (
    <View style={[screens.config]}>
      <SectionList
        style={{ flex: 1 }}
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <PaddedView
            style={{ flexDirection: 'row', borderBottomColor: colors.grey, borderBottomWidth: 1 }}
          >
            <Image source={icons.calendar} />
            <Text style={{ ...texts.medium, marginLeft: padding }}>{section.title}</Text>
          </PaddedView>
        )}
        renderItem={({ item }) => {
          const createdOn = getOrderCreatedOn(item);
          const title =
            item.type === 'food' ? item.business?.name ?? '' : formatAddress(item.origin!.address);
          const subtitle = createdOn
            ? separateWithDot(formatDate(createdOn), formatTime(createdOn))
            : '';
          return (
            <ConfigItem title={title} subtitle={subtitle} onPress={() => orderSelectHandler(item)}>
              <StatusBadge status={item.status} />
            </ConfigItem>
          );
        }}
      />
    </View>
  );
}
