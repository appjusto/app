import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { PushMessage } from 'appjusto-types';
import React from 'react';
import { useQuery } from 'react-query';
import ArrowBox from '../../common/components/views/ArrowBox';
import Chat from '../../common/screens/Chat';
import PermissionDeniedFeedback from '../../common/screens/PermissionDeniedFeedback';
import { t } from '../../strings';
import { LoggedParamList } from '../types';
import Home from './Home';
import { OrderNavigator } from './orders/common/OrderNavigator';
import CreateOrderP2P from './orders/p2p-order/CreateOrderP2P';
import RestaurantsNavigator from './restaurants/RestaurantsNavigator';
import { HomeNavigatorParamList } from './types';

type ScreenNavigationProp = BottomTabNavigationProp<LoggedParamList, 'HomeNavigator'>;

type Props = {
  navigation: ScreenNavigationProp;
};

const Stack = createStackNavigator<HomeNavigatorParamList>();
export default function ({ navigation }: Props) {
  const chatQuery = useQuery<PushMessage[]>(['notifications', 'order-chat'], () => []);
  React.useEffect(() => {
    if (!chatQuery.data || chatQuery.data.length === 0) return;
    const [notification] = chatQuery.data;
    if (notification.clicked) {
      navigation.navigate('HomeNavigator', {
        screen: 'OrderNavigator',
        params: {
          screen: 'OngoingOrder',
          params: {
            orderId: notification.data.orderId,
            newMessage: true,
          },
        },
      });
    }
  }, [chatQuery.data]);
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerBackImage: () => <ArrowBox flipped />,
        headerBackTitleVisible: false,
      })}
    >
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen
        name="CreateOrderP2P"
        component={CreateOrderP2P}
        options={{ title: t('Novo pedido') }}
      />
      <Stack.Screen name="Chat" component={Chat} options={{ title: t('Chat') }} />
      <Stack.Screen
        name="PermissionDeniedFeedback"
        component={PermissionDeniedFeedback}
        options={{ title: t('Compartilhar sua localização') }}
      />
      <Stack.Screen
        name="OrderNavigator"
        component={OrderNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RestaurantsNavigator"
        component={RestaurantsNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
