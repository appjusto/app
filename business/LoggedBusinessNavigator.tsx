import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../common/app/context';
import { defaultScreenOptions } from '../common/screens/options';
import { getManager } from '../common/store/business/selectors';
import { getFlavor } from '../common/store/config/selectors';
import { observeProfile } from '../common/store/user/actions';
import { getUser } from '../common/store/user/selectors';
import { colors, screens } from '../common/styles';
import { LoggedContextProvider } from '../consumer/v2/LoggedContext';
import { t } from '../strings';
import { BusinessNavigator } from './BusinessNavigator';
import { BusinessPending } from './orders/screens/BusinessPending';
import { LoggedBusinessNavParamsList } from './types';

const Stack = createStackNavigator<LoggedBusinessNavParamsList>();

export const LoggedBusinessNavigator = () => {
  // context
  const api = React.useContext(ApiContext);
  // redux
  const dispatch = useDispatch<AppDispatch>();
  const flavor = useSelector(getFlavor);
  const user = useSelector(getUser);
  const manager = useSelector(getManager);
  // const business = useActiveBusiness();
  const uid = user?.uid;
  // side effects
  // subscribe for profile changes
  React.useEffect(() => {
    if (uid) return dispatch(observeProfile(api)(flavor, uid));
  }, [dispatch, api, flavor, uid]);
  // TODO: subscribe to restaurant's orders ???
  // helpers
  if (!manager) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  const initialRouteName =
    manager.situation === 'pending' ? 'BusinessPending' : 'BusinessNavigator';
  // UI
  return (
    <LoggedContextProvider>
      <Stack.Navigator screenOptions={defaultScreenOptions} initialRouteName={initialRouteName}>
        <Stack.Screen
          name="BusinessPending"
          component={BusinessPending}
          options={{ title: t('Cadastro pendente') }}
        />
        <Stack.Screen
          name="BusinessNavigator"
          component={BusinessNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </LoggedContextProvider>
  );
};
