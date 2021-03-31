import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChatPushMessageData, OrderMatchPushMessageData, PushMessage } from 'appjusto-types';
import React from 'react';
import { Image } from 'react-native';
import { useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import * as icons from '../../../assets/icons';
import { useObserveOngoingOrders } from '../../../common/store/api/order/hooks/useObserveOngoingOrders';
import { getUser } from '../../../common/store/user/selectors';
import { colors, halfPadding, texts } from '../../../common/styles';
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
  const matchingQuery = useQuery<PushMessage[]>(['notifications', 'matching'], () => []);
  const chatQuery = useQuery<PushMessage[]>(['notifications', 'order-chat'], () => []);

  // effects
  // subscribe for observing ongoing orders
  const options = React.useMemo(() => ({ courierId: user?.uid }), [user?.uid]);
  useObserveOngoingOrders(options);
  React.useEffect(() => {
    // console.log("MainNavigator ['notifications', 'matching']");
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
        ['notifications', 'matching'],
        (notifications: PushMessage[] | undefined) =>
          (notifications ?? []).filter((item) => item.id !== notification.id)
      );
    }
  }, [matchingQuery.data, navigation, queryCache]);

  React.useEffect(() => {
    // console.log("MainNavigator ['notifications', 'order-chat']");
    if (!chatQuery.data || chatQuery.data.length === 0) return;
    const [notification] = chatQuery.data;
    // console.log(notification);
    if (notification.clicked) {
      const data = notification.data as ChatPushMessageData;
      navigation.navigate('OngoingDeliveryNavigator', {
        screen: 'OngoingDelivery',
        params: {
          orderId: data.orderId,
          newMessage: true,
        },
      });
    }
  }, [chatQuery.data, navigation]);

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: colors.black,
        inactiveTintColor: colors.black,
        activeBackgroundColor: colors.green500,
        inactiveBackgroundColor: colors.white,
        style: { height: 60, justifyContent: 'center' },
        tabStyle: {
          borderRadius: 30,
          height: 40,
          marginTop: halfPadding,
        },
        labelStyle: { ...texts.xs, marginBottom: 4 },
        labelPosition: 'beside-icon',
      }}
      initialRouteName="DeliveryHistory"
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
