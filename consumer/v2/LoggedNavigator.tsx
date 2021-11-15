import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../common/app/context';
import { useUpdateLocation } from '../../common/location/useUpdateLocation';
import { defaultScreenOptions } from '../../common/screens/options';
import { Onboarding } from '../../common/screens/unlogged/onboarding/Onboarding';
import { SelectLocation } from '../../common/screens/unlogged/onboarding/SelectLocation';
import { useObserveOngoingOrders } from '../../common/store/api/order/hooks/useObserveOngoingOrders';
import { getFlavor } from '../../common/store/config/selectors';
import { getConsumer } from '../../common/store/consumer/selectors';
import { observeProfile } from '../../common/store/user/actions';
import { getUser } from '../../common/store/user/selectors';
import { colors, screens } from '../../common/styles';
import { t } from '../../strings';
import { DeliveredOrderNavigator } from './delivered/DeliveredOrderNavigator';
import { FoodOrderNavigator } from './food/FoodOrderNavigator';
import { LoggedContextProvider } from './LoggedContext';
import { MainNavigator } from './main/MainNavigator';
import ProfileNavigator from './main/profile/ProfileNavigator';
import { OngoingOrderCancelFeedback } from './ongoing/OngoingOrderCancelFeedback';
import { OngoingOrderNavigator } from './ongoing/OngoingOrderNavigator';
import { P2POrderNavigator } from './p2p/P2POrderNavigator';
import { LoggedNavigatorParamList } from './types';
import { UnapprovedConsumerNavigator } from './UnapprovedConsumerNavigator';

const Stack = createStackNavigator<LoggedNavigatorParamList>();

export const LoggedNavigator = () => {
  // context
  const api = React.useContext(ApiContext);
  // redux
  const dispatch = useDispatch<AppDispatch>();
  const flavor = useSelector(getFlavor);
  const user = useSelector(getUser);
  const consumer = useSelector(getConsumer);
  const uid = user?.uid;
  // side effects
  // subscribe for profile changes
  React.useEffect(() => {
    if (uid) return dispatch(observeProfile(api)(flavor, uid));
  }, [dispatch, api, flavor, uid]);
  // update location
  useUpdateLocation();
  // subscribe for observing ongoing orders
  const options = React.useMemo(() => ({ consumerId: uid }), [uid]);
  useObserveOngoingOrders(options);
  // UI
  if (!consumer?.situation) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  const { situation, onboarded } = consumer;
  let initialRouteName: 'MainNavigator' | 'ConsumerOnboarding' | undefined = undefined;
  if (situation === 'approved') {
    initialRouteName = 'MainNavigator';
  } else if (onboarded) {
    initialRouteName = 'MainNavigator';
  } else if (!onboarded) {
    initialRouteName = 'ConsumerOnboarding';
  }

  if (situation === 'blocked' || situation === 'deleted' || situation === 'rejected') {
    return <UnapprovedConsumerNavigator />;
  }
  return (
    <LoggedContextProvider>
      <Stack.Navigator screenOptions={defaultScreenOptions} initialRouteName={initialRouteName}>
        <Stack.Screen
          name="ConsumerOnboarding"
          component={Onboarding}
          options={{ title: t('Boas vindas ao AppJusto'), headerLeft: () => null }}
        />
        <Stack.Screen
          name="SelectLocation"
          component={SelectLocation}
          options={{ title: t('Informe sua localização') }}
        />
        <Stack.Screen
          name="MainNavigator"
          component={MainNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="P2POrderNavigator"
          component={P2POrderNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FoodOrderNavigator"
          component={FoodOrderNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OngoingOrderNavigator"
          component={OngoingOrderNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DeliveredOrderNavigator"
          component={DeliveredOrderNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileNavigator"
          component={ProfileNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OngoingOrderCancelFeedback"
          component={OngoingOrderCancelFeedback}
          options={{ title: t('Pedido cancelado') }}
        />
      </Stack.Navigator>
    </LoggedContextProvider>
  );
};
