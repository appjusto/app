import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Image, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { headerMenu } from '../assets/icons';
import { ApiContext, AppDispatch } from '../common/app/context';
import { defaultScreenOptions } from '../common/screens/options';
import { AboutApp } from '../common/screens/profile/AboutApp';
import Terms from '../common/screens/unlogged/Terms';
import { getFlavor } from '../common/store/config/selectors';
import { t } from '../strings';
import { ManagerOptions } from './orders/screens/ManagerOptions';
import { OrderDetail } from './orders/screens/OrderDetail';
import { OrdersManager } from './orders/screens/OrdersManager';
import { BusinessNavParamsList } from './types';

const Stack = createStackNavigator<BusinessNavParamsList>();

export const BusinessNavigator = () => {
  // context
  const api = React.useContext(ApiContext);
  // redux
  const dispatch = useDispatch<AppDispatch>();
  const flavor = useSelector(getFlavor);
  // const user = useSelector(getUser);
  // const manager = useSelector(getManager);
  // const business = useActiveBusiness();
  // const uid = user?.uid;
  // console.log('uid', uid);
  // side effects
  // subscribe for profile changes
  // React.useEffect(() => {
  //   if (uid) return dispatch(observeProfile(api)(flavor, uid));
  // }, [dispatch, api, flavor, uid]);
  // TODO: subscribe to restaurant's orders ???

  // UI
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="OrdersManager"
        component={OrdersManager}
        options={({ navigation, route }) => ({
          title: t('Gerenciador de pedidos'),
          headerLeft: () => (
            <TouchableWithoutFeedback onPress={() => navigation.navigate('ManagerOptions')}>
              <View style={{ marginLeft: 12 }}>
                <Image source={headerMenu} height={32} width={32} />
              </View>
            </TouchableWithoutFeedback>
          ),
        })}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={{ title: t('Ver pedido') }}
      />
      <Stack.Screen
        name="ManagerOptions"
        component={ManagerOptions}
        options={{ title: t('Menu') }}
      />
      <Stack.Screen
        name="AboutApp"
        component={AboutApp}
        options={{ title: t('Sobre o AppJusto') }}
      />
      <Stack.Screen name="Terms" component={Terms} options={{ title: t('Fique por dentro') }} />
    </Stack.Navigator>
  );
};
