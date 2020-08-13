import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useContext } from 'react';
import { Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import * as icons from '../../assets/icons';
import { getFlavor } from '../../store/config/selectors';
import { getConsumer } from '../../store/consumer/selectors';
import { observeOrdersCreatedBy } from '../../store/order/actions';
import { observeProfile } from '../../store/user/actions';
import { getUser } from '../../store/user/selectors';
import { t } from '../../strings';
import { AppDispatch, ApiContext } from '../app/context';
import { colors } from '../common/styles';
import ProfileNavigator from '../profile/ProfileNavigator';
import HistoryNavigator from './history/HistoryNavigator';
import HomeNavigator from './home/HomeNavigator';

const Tab = createBottomTabNavigator();
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
  useEffect(() => {
    return dispatch(observeOrdersCreatedBy(api)(user!.uid));
  }, []);

  // UI
  if (!consumer) return null;
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
        name="Home"
        component={HomeNavigator}
        options={{ title: t('Início'), tabBarIcon: () => <Image source={icons.home} /> }}
      />
      <Tab.Screen
        name="History"
        component={HistoryNavigator}
        options={{ title: t('Seus pedidos'), tabBarIcon: () => <Image source={icons.orders} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{ title: t('Sua conta'), tabBarIcon: () => <Image source={icons.user} /> }}
      />
    </Tab.Navigator>
  );
}
