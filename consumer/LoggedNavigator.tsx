import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { ActivityIndicator, Image, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as icons from '../assets/icons';
import { ApiContext, AppDispatch } from '../common/app/context';
import { useObserveOngoingOrders } from '../common/store/api/order/hooks/useObserveOngoingOrders';
import { getFlavor } from '../common/store/config/selectors';
import { getConsumer } from '../common/store/consumer/selectors';
import { observeProfile } from '../common/store/user/actions';
import { getUser } from '../common/store/user/selectors';
import { colors, halfPadding, screens, texts } from '../common/styles';
import { t } from '../strings';
import HistoryNavigator from './history/HistoryNavigator';
import HomeNavigator from './home/HomeNavigator';
import ProfileNavigator from './profile/ProfileNavigator';
import { LoggedParamList } from './types';

const Tab = createBottomTabNavigator<LoggedParamList>();
export default function () {
  // context
  const dispatch = useDispatch<AppDispatch>();
  const api = React.useContext(ApiContext);
  // redux store
  const flavor = useSelector(getFlavor);
  const user = useSelector(getUser);
  const consumer = useSelector(getConsumer);
  // side effects
  // subscribe for profile changes
  React.useEffect(() => {
    return dispatch(observeProfile(api)(flavor, user!.uid));
  }, []);
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
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: colors.black,
        inactiveTintColor: colors.black,
        activeBackgroundColor: colors.green500,
        inactiveBackgroundColor: colors.white,
        style: { height: 60, justifyContent: 'center' },
        tabStyle: {
          borderRadius: 30,
          height: 40,
          marginTop: halfPadding,
        },
        labelStyle: { ...texts.xs, marginBottom: 4 },
        labelPosition: 'beside-icon',
      }}
    >
      <Tab.Screen
        name="HomeNavigator"
        component={HomeNavigator}
        options={{
          title: t('Início'),
          tabBarIcon: () => <Image source={icons.home} style={{ marginBottom: 5 }} />,
        }}
      />
      <Tab.Screen
        name="HistoryNavigator"
        component={HistoryNavigator}
        options={{
          title: t('Seus pedidos'),
          tabBarIcon: () => <Image source={icons.orders} style={{ marginBottom: 5 }} />,
        }}
      />
      <Tab.Screen
        name="ProfileNavigator"
        component={ProfileNavigator}
        options={{
          title: t('Sua conta'),
          tabBarIcon: () => <Image source={icons.user} style={{ marginBottom: 5 }} />,
        }}
      />
    </Tab.Navigator>
  );
}
