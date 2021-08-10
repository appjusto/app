import { OrderMatchPushMessageData, PushMessageData } from '@appjusto/types';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import * as icons from '../../../assets/icons';
import { useObserveOngoingOrders } from '../../../common/store/api/order/hooks/useObserveOngoingOrders';
import { getCourier } from '../../../common/store/courier/selectors';
import { getUser } from '../../../common/store/user/selectors';
import { halfPadding, padding, texts } from '../../../common/styles';
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
  const courier = useSelector(getCourier)!;
  // handlers
  const handler = React.useCallback(
    (data: PushMessageData, clicked?: boolean, remove?: () => void) => {
      if (data.action === 'order-request' && courier.status !== 'dispatching') {
        Sentry.Native.captureMessage('Push received', {
          extra: {
            action: data.action,
            orderId: data.orderId,
          },
        });
        remove!();
        navigation.navigate('MatchingNavigator', {
          screen: 'Matching',
          params: {
            matchRequest: data as OrderMatchPushMessageData,
          },
        });
      } else if (data.action === 'order-update') {
        if (clicked) {
          remove!();
          navigation.navigate('OngoingDeliveryNavigator', {
            screen: 'OngoingDelivery',
            params: {
              orderId: data.orderId,
            },
          });
        }
      } else if (data.action === 'order-chat') {
        if (clicked) {
          remove!();
          navigation.navigate('OngoingDeliveryNavigator', {
            screen: 'OngoingDelivery',
            params: {
              orderId: data.orderId,
              chatFrom: data.from,
            },
          });
        }
      }
    },
    [navigation, courier.status]
  );
  // side effects
  // subscribe for observing ongoing orders
  const options = React.useMemo(() => ({ courierId: user?.uid }), [user?.uid]);
  useObserveOngoingOrders(options);
  useNotificationHandler('order-request', handler);
  useNotificationHandler('order-update', handler);
  useNotificationHandler('order-chat', handler);
  const { width } = Dimensions.get('window');
  // UI
  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        style: {
          height: 65,
          paddingVertical: 20,
          paddingHorizontal: padding,
          width,
        },
        tabStyle: {
          height: 24,
          alignContent: 'flex-start',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                left: -16,
              }}
            >
              <Image
                source={focused ? icons.homeFocused : icons.home}
                style={{
                  height: 24,
                  width: 24,
                  marginRight: halfPadding,
                }}
              />
              <Text style={{ ...texts.xs, fontFamily: focused ? 'BarlowBold' : 'BarlowMedium' }}>
                {t('Início')}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="DeliveryHistory"
        component={DeliveryHistory}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                left: -8,
              }}
            >
              <Image
                source={focused ? icons.ordersFocused : icons.orders}
                style={{
                  height: 24,
                  width: 24,
                  marginRight: halfPadding,
                }}
              />
              <Text style={{ ...texts.xs, fontFamily: focused ? 'BarlowBold' : 'BarlowMedium' }}>
                {t('Suas corridas')}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <Image
                source={focused ? icons.userFocused : icons.user}
                style={{
                  height: 24,
                  width: 24,
                  marginRight: halfPadding,
                }}
              />
              <Text style={{ ...texts.xs, fontFamily: focused ? 'BarlowBold' : 'BarlowMedium' }}>
                {t('Sua conta')}
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
