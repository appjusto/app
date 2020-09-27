import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChatPushMessageData, OrderMatchPushMessageData, PushMessageData } from 'appjusto-types';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useCallback } from 'react';
import { Image } from 'react-native';
import { useSelector } from 'react-redux';

import * as icons from '../../assets/icons';
import useNotification from '../../common/hooks/useNotification';
import useObserveOrders from '../../common/hooks/useObserveOrders';
import { getCourier, getCourierStatus } from '../../common/store/courier/selectors';
import { getOngoingOrders } from '../../common/store/order/selectors';
import { colors } from '../../common/styles';
import { t } from '../../strings';
import DeliveriesNavigator from './history/DeliveriesNavigator';
import HomeNavigator from './home/HomeNavigator';
import ProfileNavigator from './profile/ProfileNavigator';
import { MainParamList, ApprovedParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<ApprovedParamList, 'Main'>;

type Props = {
  navigation: ScreenNavigationProp;
};

const Tab = createBottomTabNavigator<MainParamList>();
export default function ({ navigation }: Props) {
  // app state
  const courier = useSelector(getCourier);
  const status = useSelector(getCourierStatus);
  const ongoingOrders = useSelector(getOngoingOrders);

  // effects
  // subscribe for order changes
  useObserveOrders({ deliveredBy: courier!.id! });

  // when a courier accept the order
  useEffect(() => {
    // as the courier can only dispatch a single order at a time ongoingOrders should be always 0 or 1
    if (ongoingOrders.length > 0) {
      const [order] = ongoingOrders;
      navigation.navigate('OngoingDelivery', { orderId: order.id });
    }
  }, [ongoingOrders]);

  // handlers
  const notificationHandler = useCallback(
    (content: Notifications.NotificationContent) => {
      console.log('notificationHandler');
      const data = (content.data as unknown) as PushMessageData;
      console.log(data);
      if (data.action === 'matching') {
        // should always be true as couriers should receive matching notifications only when they're available
        if (status === 'available') {
          navigation.navigate('Matching', {
            matchRequest: data as OrderMatchPushMessageData,
          });
        }
      } else if (data.action === 'order-chat') {
        navigation.navigate('OngoingDelivery', {
          orderId: (data as ChatPushMessageData).orderId,
          newMessage: true,
        });
      }
    },
    [navigation, status]
  );
  useNotification(notificationHandler);

  // test only
  // useEffect(() => {
  //   setTimeout(() => {
  //     navigation.navigate('Matching', {
  //       matchRequest: {
  //         orderId: '12',
  //         courierFee: '10',
  //         originAddress: 'Shopping Iguatemi - Edson Queiroz, Fortaleza - CE, 60810-350, Brasil',
  //         destinationAddress:
  //           'Rua Canuto de Aguiar, 500 - Meireles, Fortaleza - CE, 60160-120, Brasil',
  //         distanceToOrigin: 2,
  //         totalDistance: 10,
  //       },
  //     });
  //   }, 50);
  // }, []);

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: colors.black,
        inactiveTintColor: colors.black,
        activeBackgroundColor: colors.green,
        inactiveBackgroundColor: colors.white,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{ title: t('Início'), tabBarIcon: () => <Image source={icons.home} /> }}
      />
      <Tab.Screen
        name="Deliveries"
        component={DeliveriesNavigator}
        options={{ title: t('Suas corridas'), tabBarIcon: () => <Image source={icons.orders} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{ title: t('Sua conta'), tabBarIcon: () => <Image source={icons.user} /> }}
      />
    </Tab.Navigator>
  );
}
