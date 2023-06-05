import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../common/app/context';
import { defaultScreenOptions } from '../common/screens/options';
import { getFlavor } from '../common/store/config/selectors';
import { observeProfile } from '../common/store/user/actions';
import { getUser } from '../common/store/user/selectors';
import { LoggedContextProvider } from '../consumer/v2/LoggedContext';
import { BusinessAppProvider } from './BusinessAppContext';
import { BusinessNavigator } from './BusinessNavigator';
import { LoggedBusinessNavParamsList } from './types';

const Stack = createStackNavigator<LoggedBusinessNavParamsList>();

export const LoggedBusinessNavigator = () => {
  // context
  const api = React.useContext(ApiContext);
  // redux
  const dispatch = useDispatch<AppDispatch>();
  const flavor = useSelector(getFlavor);
  const user = useSelector(getUser);
  const uid = user?.uid;
  // side effects
  // subscribe for profile changes
  React.useEffect(() => {
    if (uid) return dispatch(observeProfile(api)(flavor, uid));
  }, [dispatch, api, flavor, uid]);
  // UI
  return (
    <LoggedContextProvider>
      <BusinessAppProvider>
        <Stack.Navigator screenOptions={defaultScreenOptions}>
          {/* <Stack.Screen
            name="BusinessPending"
            component={BusinessPending}
            options={{ title: t('Cadastro pendente') }}
          /> */}
          <Stack.Screen
            name="BusinessNavigator"
            component={BusinessNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </BusinessAppProvider>
    </LoggedContextProvider>
  );
};
