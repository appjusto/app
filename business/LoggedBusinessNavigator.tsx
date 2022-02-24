import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { headerMenu } from '../assets/icons';
import { ApiContext, AppDispatch } from '../common/app/context';
import { defaultScreenOptions } from '../common/screens/options';
import { getFlavor } from '../common/store/config/selectors';
import { observeProfile } from '../common/store/user/actions';
import { getUser } from '../common/store/user/selectors';
import { t } from '../strings';
import { OrderDetail } from './orders/screens/OrderDetail';
import { OrdersManager } from './orders/screens/OrdersManager';
import { LoggedBusinessNavParamsList } from './types';

//TODO: create and add params list
const Stack = createStackNavigator<LoggedBusinessNavParamsList>();

export const LoggedBusinessNavigator = () => {
  //TODO: wrap this stack with the right context
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
  // subscribe to restaurant's orders ???
  <Stack.Navigator screenOptions={defaultScreenOptions}>
    <Stack.Screen
      name="OrdersManager"
      component={OrdersManager}
      options={{
        title: t('Gerenciador de pedidos'),
        headerLeft: () => <Image source={headerMenu} height={32} width={32} />,
      }}
    />
    <Stack.Screen name="OrderDetail" component={OrderDetail} options={{ title: t('Ver pedido') }} />
  </Stack.Navigator>;
};
