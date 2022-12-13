import { PushMessageData } from '@appjusto/types';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Image, TouchableWithoutFeedback, View } from 'react-native';
import { useSelector } from 'react-redux';
import { headerMenu } from '../assets/icons';
import { ApiContext } from '../common/app/context';
import { useNotificationToken } from '../common/hooks/useNotificationToken';
import Chat from '../common/screens/Chat';
import { defaultScreenOptions } from '../common/screens/options';
import { AboutApp } from '../common/screens/profile/AboutApp';
import { NotificationPreferences } from '../common/screens/profile/notifications/NotificationPreferences';
import Terms from '../common/screens/unlogged/Terms';
import { track } from '../common/store/api/track';
import { getManager } from '../common/store/business/selectors';
import { colors, screens } from '../common/styles';
import { useNotificationHandler } from '../consumer/v2/main/useNotificationHandler';
import { t } from '../strings';
import { BusinessAppContext } from './BusinessAppContext';
import { MessagesIcon } from './orders/components/MessagesIcon';
import { BusinessChats } from './orders/screens/BusinessChats';
import { BusinessOptions } from './orders/screens/BusinessOptions';
import { BusinessOrders } from './orders/screens/BusinessOrders';
import { BusinessProfile } from './orders/screens/BusinessProfile';
import { OrderDetail } from './orders/screens/OrderDetail';
import { SelectBusiness } from './orders/screens/SelectBusiness';
import { BusinessNavParamsList, LoggedBusinessNavParamsList } from './types';
import { UnaprovedBusinessNavigator } from './UnapprovedBusinessNavigator';
import { KEEP_ALIVE_INTERVAL, startKeepAliveTask, stopKeepAliveTask } from './utils/keepAlive';

type ScreenNavigationProp = StackNavigationProp<LoggedBusinessNavParamsList, 'BusinessNavigator'>;

const Stack = createStackNavigator<BusinessNavParamsList>();

export const BusinessNavigator = () => {
  // context
  const api = React.useContext(ApiContext);
  const navigation = useNavigation<ScreenNavigationProp>();
  const { business, unreadCount } = React.useContext(BusinessAppContext);
  const status = business?.status;
  const manager = useSelector(getManager);
  const managerSituation = manager?.situation;
  const businessSituation = business?.situation;
  // side effects
  useNotificationToken();
  // starting/stoping keepAlive task/internval
  React.useEffect(() => {
    if (!status) return;
    (async () => {
      if (status === 'open') {
        await api.business().sendKeepAlive(business.id);
        await startKeepAliveTask();
        const keepAliveInterval = setInterval(async () => {
          await api.business().sendKeepAlive(business.id);
        }, KEEP_ALIVE_INTERVAL * 1000);
        return () => clearInterval(keepAliveInterval);
      } else if (status === 'closed') {
        await stopKeepAliveTask();
      }
    })();
  }, [status]);
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
          navigation.navigate('BusinessNavigator', {
            screen: 'OrderChat',
            params: {
              orderId: data.orderId,
              counterpartId: data.from.id,
              counterpartFlavor: data.from.agent,
            },
          });
        }
      } else if (data.action === 'order-update') {
        // new order and order canceled pushes
        if (clicked) {
          track('Push clicked by manager', {
            action: data.action,
            orderId: data.orderId,
          });
          remove!();
          navigation.navigate('BusinessNavigator', {
            screen: 'OrderDetail',
            params: {
              orderId: data.orderId,
            },
          });
        }
      } else {
        if (clicked) {
          remove!();
          track('business clicked in random push message sent by our team');
        }
      }
    },
    [navigation]
  );
  useNotificationHandler('order-chat', handler);
  // UI
  if (!business || !manager) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  if (managerSituation !== 'approved' || businessSituation !== 'approved') {
    return <UnaprovedBusinessNavigator />;
  }
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="BusinessOrders"
        component={BusinessOrders}
        options={({ navigation }) => ({
          title: t('Gerenciador de pedidos'),
          headerLeft: () => (
            <TouchableWithoutFeedback onPress={() => navigation.navigate('BusinessOptions')}>
              <View style={{ marginLeft: 12 }}>
                <Image source={headerMenu} style={{ height: 32, width: 32 }} />
              </View>
            </TouchableWithoutFeedback>
          ),
          headerRight: () => (
            <View style={{ marginRight: 12 }}>
              <MessagesIcon
                onPress={() => navigation.navigate('BusinessChats')}
                unreadMessages={unreadCount}
              />
            </View>
          ),
        })}
      />
      {/* <Stack.Screen
        name="BusinessPending"
        component={BusinessPending}
        options={{ title: t('Cadastro pendente') }}
      /> */}
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
        name="SelectBusiness"
        component={SelectBusiness}
        options={{ title: t('Restaurantes') }}
      />
      <Stack.Screen
        name="BusinessOptions"
        component={BusinessOptions}
        options={{ title: t('Menu') }}
      />
      <Stack.Screen
        name="AboutApp"
        component={AboutApp}
        options={{ title: t('Sobre o AppJusto') }}
      />
      <Stack.Screen
        name="BusinessProfile"
        component={BusinessProfile}
        options={{ title: t('Seus dados') }}
      />
      <Stack.Screen
        name="NotificationPreferences"
        component={NotificationPreferences}
        options={{ title: t('Notificações') }}
      />
      <Stack.Screen name="OrderChat" component={Chat} options={{ title: t('Chats') }} />
      <Stack.Screen name="Terms" component={Terms} options={{ title: t('Fique por dentro') }} />
    </Stack.Navigator>
  );
};
