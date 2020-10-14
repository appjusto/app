import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useContext } from 'react';
import { ActivityIndicator, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import * as icons from '../assets/icons';
import { AppDispatch, ApiContext } from '../common/app/context';
import useObserveOrders from '../common/hooks/useObserveOrders';
import { getFlavor } from '../common/store/config/selectors';
import { getConsumer } from '../common/store/consumer/selectors';
import { observeProfile } from '../common/store/user/actions';
import { getUser } from '../common/store/user/selectors';
import { colors } from '../common/styles';
import { t } from '../strings';
import HistoryNavigator from './history/HistoryNavigator';
import HomeNavigator from './home/HomeNavigator';
import ProfileNavigator from './profile/ProfileNavigator';
import { LoggedParamList } from './types';

const Tab = createBottomTabNavigator<LoggedParamList>();
export default function () {
  // context
  const dispatch = useDispatch<AppDispatch>();
  const api = useContext(ApiContext);
  // app state
  const flavor = useSelector(getFlavor);
  const user = useSelector(getUser);
  const consumer = useSelector(getConsumer);

  // side effects
  // subscribe for profile changes
  useEffect(() => {
    return dispatch(observeProfile(api)(flavor, user!.uid));
  }, []);
  // subscribe for order changes
  useObserveOrders({ createdBy: user?.uid });

  // UI
  if (consumer?.situation !== 'approved') {
    // on the first time consumer is logged, the profile will be created by the app with the status 'pending'
    // the indicator will be showing until the trigger change the status to 'approved'
    // TODO: handle other cases in the future
    return <ActivityIndicator size="large" color={colors.green} />;
  }
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: colors.black,
        inactiveTintColor: colors.black,
        activeBackgroundColor: colors.green,
        inactiveBackgroundColor: colors.white,
      }}
    >
      <Tab.Screen
        name="HomeNavigator"
        component={HomeNavigator}
        options={{
          title: t('Início'),
          tabBarIcon: () => <Image source={icons.home} />,
        }}
      />
      <Tab.Screen
        name="HistoryNavigator"
        component={HistoryNavigator}
        options={{ title: t('Seus pedidos'), tabBarIcon: () => <Image source={icons.orders} /> }}
      />
      <Tab.Screen
        name="ProfileNavigator"
        component={ProfileNavigator}
        options={{ title: t('Sua conta'), tabBarIcon: () => <Image source={icons.user} /> }}
      />
    </Tab.Navigator>
  );
}
