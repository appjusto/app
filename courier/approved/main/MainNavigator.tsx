import { OrderMatchPushMessageData, PushMessageData } from '@appjusto/types';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Image } from 'react-native';
import { useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import * as icons from '../../../assets/icons';
import { useObserveOngoingOrders } from '../../../common/store/api/order/hooks/useObserveOngoingOrders';
import { getUser } from '../../../common/store/user/selectors';
import { colors, texts } from '../../../common/styles';
import { useNotificationHandler } from '../../../consumer/v2/main/useNotificationHandler';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';
import DeliveryHistory from './history/DeliveryHistory';
import Home from './home/Home';
import Profile from './profile/Profile';
import { MainParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<ApprovedParamList, 'MainNavigator'>;

type Props = {
  navigation: ScreenNavigationProp;
};

const Tab = createBottomTabNavigator<MainParamList>();
export default function ({ navigation }: Props) {
  // redux store
  const user = useSelector(getUser);
  // handlers
  const handler = React.useCallback(
    (data: PushMessageData, clicked?: boolean, remove?: () => void) => {
      if (data.action === 'order-request') {
        Sentry.Native.captureMessage(`Received push: ${data.action}`);
        remove!();
        navigation.navigate('MatchingNavigator', {
          screen: 'Matching',
          params: {
            matchRequest: data as OrderMatchPushMessageData,
          },
        });
      } else if (data.action === 'order-update') {
        if (clicked)
          navigation.navigate('OngoingDeliveryNavigator', {
            screen: 'OngoingDelivery',
            params: {
              orderId: data.orderId,
            },
          });
      } else if (data.action === 'order-chat') {
        if (clicked)
          navigation.navigate('OngoingDeliveryNavigator', {
            screen: 'OngoingDelivery',
            params: {
              orderId: data.orderId,
              chatFrom: data.from,
            },
          });
      }
    },
    [navigation]
  );
  // side effects
  // subscribe for observing ongoing orders
  const options = React.useMemo(() => ({ courierId: user?.uid }), [user?.uid]);
  useObserveOngoingOrders(options);
  useNotificationHandler('order-request', handler);
  useNotificationHandler('order-update', handler);
  useNotificationHandler('order-chat', handler);
  // UI
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: colors.black,
        inactiveTintColor: colors.black,
        activeBackgroundColor: colors.green500,
        inactiveBackgroundColor: colors.white,
        style: { height: 65, paddingHorizontal: 4 },
        tabStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 32,
          height: 36,
          marginTop: 8,
        },
        labelStyle: { ...texts.xs, marginBottom: 5 },
        labelPosition: 'beside-icon',
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ title: t('Início'), tabBarIcon: () => <Image source={icons.home} /> }}
      />
      <Tab.Screen
        name="DeliveryHistory"
        component={DeliveryHistory}
        options={{ title: t('Suas corridas'), tabBarIcon: () => <Image source={icons.orders} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ title: t('Sua conta'), tabBarIcon: () => <Image source={icons.user} /> }}
      />
    </Tab.Navigator>
  );
}
