import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../common/app/context';
import { defaultScreenOptions } from '../../common/screens/options';
import { PermissionDenied } from '../../common/screens/PermissionDenied';
import { Onboarding } from '../../common/screens/unlogged/onboarding/Onboarding';
import { RegistrationSubmitted } from '../../common/screens/unlogged/onboarding/RegistrationSubmitted';
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
import { OngoingOrderNavigator } from './ongoing/OngoingOrderNavigator';
import { P2POrderNavigator } from './p2p/P2POrderNavigator';
import { LoggedNavigatorParamList } from './types';

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
  // subscribe for observing ongoing orders
  const options = React.useMemo(() => ({ consumerId: uid }), [uid]);
  useObserveOngoingOrders(options);
  // UI
  if (consumer?.situation !== 'approved') {
    // showing the indicator until the profile is loaded
    // the first time should take longer as the profile is created with situation === 'pending' and than
    // updated by a trigger after automatic validation
    // TODO: handle other situation cases in the future
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  return (
    <LoggedContextProvider>
      <Stack.Navigator
        screenOptions={defaultScreenOptions}
        initialRouteName={consumer.onboarded ? 'RegistrationSubmitted' : 'ConsumerOnboarding'}
      >
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
          name="RegistrationSubmitted"
          component={RegistrationSubmitted}
          options={{ headerShown: false }}
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
          name="PermissionDenied"
          component={PermissionDenied}
          options={{ title: t('Compartilhar sua localização') }}
        />
      </Stack.Navigator>
    </LoggedContextProvider>
  );
};
