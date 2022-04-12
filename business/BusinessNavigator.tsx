import { PushMessageData } from '@appjusto/types';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Image, TouchableWithoutFeedback, View } from 'react-native';
import * as Sentry from 'sentry-expo';
import { headerMenu } from '../assets/icons';
import { ApiContext } from '../common/app/context';
import { defaultScreenOptions } from '../common/screens/options';
import { AboutApp } from '../common/screens/profile/AboutApp';
import Terms from '../common/screens/unlogged/Terms';
import { track } from '../common/store/api/track';
import { colors, screens } from '../common/styles';
import { useNotificationHandler } from '../consumer/v2/main/useNotificationHandler';
import { t } from '../strings';
import { useBusinessManagedBy } from './hooks/useBusinessManagedBy';
import { MessagesIcon } from './orders/components/MessagesIcon';
import { BusinessChats } from './orders/screens/BusinessChats';
import { BusinessOrders } from './orders/screens/BusinessOrders';
import { ManagerOptions } from './orders/screens/ManagerOptions';
import { OrderDetail } from './orders/screens/OrderDetail';
import { BusinessNavParamsList, LoggedBusinessNavParamsList } from './types';

type ScreenNavigationProp = StackNavigationProp<LoggedBusinessNavParamsList, 'BusinessNavigator'>;

const Stack = createStackNavigator<BusinessNavParamsList>();

export const BusinessNavigator = () => {
  // context
  const api = React.useContext(ApiContext);
  const navigation = useNavigation<ScreenNavigationProp>();
  // redux
  const business = useBusinessManagedBy();
  // sending business keep alive timestamp to database
  const sendBusinessKeepAlive = React.useCallback(() => {
    if (!business?.id || business.status !== 'open') return;
    try {
      api.business().sendKeepAlive(business.id);
    } catch (error) {
      Sentry.Native.captureException(error);
    }
  }, [api, business]);
  React.useEffect(() => {
    if (business?.situation !== 'approved') return;
    if (business?.status !== 'open') return;
    sendBusinessKeepAlive();
    const time = process.env.REACT_APP_ENVIRONMENT === 'live' ? 180000 : 300000;
    const keepAliveInterval = setInterval(() => {
      sendBusinessKeepAlive();
    }, time);
    return () => clearInterval(keepAliveInterval);
  }, [business?.situation, business?.status, sendBusinessKeepAlive]);
  // push notifications
  // handlers
  const handler = React.useCallback(
    (data: PushMessageData, clicked?: boolean, remove?: () => void) => {
      if (data.action === 'order-chat') {
        if (clicked) {
          remove!();
          track('manager clicked in order-chat push', {
            action: data.action,
            orderId: data.orderId,
          });
          navigation.navigate('BusinessNavigator', { screen: 'BusinessChats' });
        }
      }
    },
    [navigation]
  );
  useNotificationHandler('order-chat', handler);
  // UI
  if (!business) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="BusinessOrders"
        component={BusinessOrders}
        options={({ navigation, route }) => ({
          title: t('Gerenciador de pedidos'),
          headerLeft: () => (
            <TouchableWithoutFeedback onPress={() => navigation.navigate('ManagerOptions')}>
              <View style={{ marginLeft: 12 }}>
                <Image source={headerMenu} height={32} width={32} />
              </View>
            </TouchableWithoutFeedback>
          ),
          headerRight: () => (
            <View style={{ marginRight: 12 }}>
              <MessagesIcon onPress={() => navigation.navigate('BusinessChats')} />
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={{ title: t('Ver pedido') }}
      />
      <Stack.Screen
        name="BusinessChats"
        component={BusinessChats}
        options={{ title: t('Chats') }}
      />
      <Stack.Screen
        name="ManagerOptions"
        component={ManagerOptions}
        options={{ title: t('Menu') }}
      />
      <Stack.Screen
        name="AboutApp"
        component={AboutApp}
        options={{ title: t('Sobre o AppJusto') }}
      />
      <Stack.Screen name="Terms" component={Terms} options={{ title: t('Fique por dentro') }} />
    </Stack.Navigator>
  );
};
