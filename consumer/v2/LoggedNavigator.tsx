import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../common/app/context';
import { defaultScreenOptions } from '../../common/screens/options';
import { useObserveOngoingOrders } from '../../common/store/api/order/hooks/useObserveOngoingOrders';
import { getFlavor } from '../../common/store/config/selectors';
import { getConsumer } from '../../common/store/consumer/selectors';
import { observeProfile } from '../../common/store/user/actions';
import { getUser } from '../../common/store/user/selectors';
import { colors, screens } from '../../common/styles';
import PermissionDeniedFeedback from './common/PermissionDeniedFeedback';
import { DeliveredOrderNavigator } from './delivered/DeliveredOrderNavigator';
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
  // side effects
  // subscribe for profile changes
  React.useEffect(() => {
    return dispatch(observeProfile(api)(flavor, user!.uid));
  }, [dispatch, api, flavor, user]);
  // subscribe for observing ongoing orders
  const options = React.useMemo(() => ({ consumerId: user?.uid }), [user?.uid]);
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
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="MainNavigator"
        component={MainNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PermissionDeniedFeedback"
        component={PermissionDeniedFeedback}
        options={{ title: 'Compartilhar sua localização' }}
      />
      <Stack.Screen
        name="DeliveredOrderNavigator"
        component={DeliveredOrderNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="P2POrderNavigator"
        component={P2POrderNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OngoingOrderNavigator"
        component={OngoingOrderNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileNavigator"
        component={ProfileNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
