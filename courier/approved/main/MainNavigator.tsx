import { OrderMatchPushMessageData, PushMessage } from '@appjusto/types';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Image } from 'react-native';
import { useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import * as icons from '../../../assets/icons';
import { useObserveOngoingOrders } from '../../../common/store/api/order/hooks/useObserveOngoingOrders';
import { getUser } from '../../../common/store/user/selectors';
import { colors, texts } from '../../../common/styles';
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
  // context
  const queryCache = useQueryClient();
  const matchingQuery = useQuery<PushMessage[]>(['notifications', 'order-request'], () => []);
  const orderUpdateQuery = useQuery<PushMessage[]>(['notifications', 'order-update'], () => []);
  const chatQuery = useQuery<PushMessage[]>(['notifications', 'order-chat'], () => []);
  // side effects
  // subscribe for observing ongoing orders
  const options = React.useMemo(() => ({ courierId: user?.uid }), [user?.uid]);
  useObserveOngoingOrders(options);
  // react to order-rrequest
  React.useEffect(() => {
    // console.log("MainNavigator ['notifications', 'order-request']");
    if (!matchingQuery.data || matchingQuery.data.length === 0) return;
    const [notification] = matchingQuery.data;
    // console.log(notification);
    if (notification) {
      const data = notification.data as OrderMatchPushMessageData;
      Sentry.Native.captureMessage(`Received push: ${data.action}`);
      navigation.navigate('MatchingNavigator', {
        screen: 'Matching',
        params: {
          matchRequest: data,
        },
      });
      // remove from cache
      queryCache.setQueryData(
        ['notifications', 'order-request'],
        (notifications: PushMessage[] | undefined) =>
          (notifications ?? []).filter((item) => item.id !== notification.id)
      );
    }
  }, [matchingQuery.data, navigation, queryCache]);
  // react to order-chat
  React.useEffect(() => {
    // console.log("MainNavigator ['notifications', 'order-chat']");
    if (!chatQuery.data || chatQuery.data.length === 0) return;
    const [notification] = chatQuery.data;
    // console.log(notification);
    if (notification.clicked) {
      navigation.navigate('OngoingDeliveryNavigator', {
        screen: 'OngoingDelivery',
        params: {
          orderId: notification.data.orderId,
          newMessage: true,
        },
      });
    }
  }, [chatQuery.data, navigation]);
  // react to order-update
  React.useEffect(() => {
    if (!orderUpdateQuery.data || orderUpdateQuery.data.length === 0) return;
    const [notification] = orderUpdateQuery.data;
    if (notification.clicked) {
      navigation.navigate('OngoingDeliveryNavigator', {
        screen: 'OngoingDelivery',
        params: {
          orderId: notification.data.orderId,
        },
      });
    }
  }, [orderUpdateQuery.data, navigation]);

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
