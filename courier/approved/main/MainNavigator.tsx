import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { OrderMatchPushMessageData, PushMessageData } from 'appjusto-types';
import * as Notifications from 'expo-notifications';
import React, { useCallback } from 'react';
import { Image } from 'react-native';
import { useSelector } from 'react-redux';
import * as icons from '../../../assets/icons';
import useNotification from '../../../common/hooks/useNotification';
import useObserveOngoingOrders from '../../../common/store/api/order/hooks/useObserveOngoingOrders';
import { getCourierStatus } from '../../../common/store/courier/selectors';
import { getUser } from '../../../common/store/user/selectors';
import { colors, halfPadding, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';
import DeliveriesNavigator from './history/DeliveriesNavigator';
import HomeNavigator from './home/HomeNavigator';
import ProfileNavigator from './profile/ProfileNavigator';
import { MainParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<ApprovedParamList, 'MainNavigator'>;

type Props = {
  navigation: ScreenNavigationProp;
};

const Tab = createBottomTabNavigator<MainParamList>();
export default function ({ navigation }: Props) {
  // app state
  const user = useSelector(getUser);
  const status = useSelector(getCourierStatus);

  // effects
  // subscribe for observing ongoing orders
  const options = React.useMemo(() => ({ courierId: user?.uid }), [user?.uid]);
  useObserveOngoingOrders(options);

  // handlers
  const notificationHandler = useCallback(
    (content: Notifications.NotificationContent) => {
      console.log('notificationHandler');
      const data = (content.data as unknown) as PushMessageData;
      console.log(data);
      if (data.action === 'matching') {
        // should always be true as couriers should receive matching notifications only when they're available
        if (status === 'available') {
          navigation.navigate('MatchingNavigator', {
            screen: 'Matching',
            params: {
              matchRequest: data as OrderMatchPushMessageData,
            },
          });
        }
      } else if (data.action === 'order-chat') {
        // navigation.navigate('OngoingDelivery', {
        //   orderId: (data as ChatPushMessageData).orderId,
        //   newMessage: true,
        // });
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
        style: { height: 60, justifyContent: 'center' },
        tabStyle: {
          borderRadius: 30,
          height: 40,
          marginTop: halfPadding,
        },
        labelStyle: { ...texts.small, marginBottom: 4 },
        labelPosition: 'beside-icon',
      }}
    >
      <Tab.Screen
        name="HomeNavigator"
        component={HomeNavigator}
        options={{ title: t('Início'), tabBarIcon: () => <Image source={icons.home} /> }}
      />
      <Tab.Screen
        name="DeliveriesNavigator"
        component={DeliveriesNavigator}
        options={{ title: t('Suas corridas'), tabBarIcon: () => <Image source={icons.orders} /> }}
      />
      <Tab.Screen
        name="ProfileNavigator"
        component={ProfileNavigator}
        options={{ title: t('Sua conta'), tabBarIcon: () => <Image source={icons.user} /> }}
      />
    </Tab.Navigator>
  );
}
