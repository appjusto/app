import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useContext, useCallback } from 'react';
import { Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { t } from '../../../../strings';
import { ApiContext } from '../../../app/context';
import { texts } from '../../../common/styles';
import { HomeStackParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Matching'>;
type ScreenRouteProp = RouteProp<HomeStackParamList, 'Matching'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const api = useContext(ApiContext);
  const { params } = route;
  const order = params.order;

  // handlers
  const acceptHandler = useCallback(async () => {
    const match = await api.matchOrder(order.orderId);
    console.log(match);
    // TODO: if successful, go to Delivering screen
  }, [order]);

  const rejectHandler = useCallback(() => {
    navigation.goBack();
    // TODO: ask why
  }, [order]);

  // side effects
  useEffect(() => {
    if (!order) navigation.goBack();
  }, []);

  // UI
  if (!order) return null;

  return (
    <SafeAreaView>
      <Text style={[texts.default, { fontSize: 20, lineHeight: 24 }]}>
        {t('Nova corrida para você!')}
      </Text>
      <Text style={[texts.huge]}>
        {t('R$')} {order.fare}
      </Text>
      <Text style={[texts.huge]}>
        {t('Retirada')} {order.origin.address}
      </Text>
      <Text style={[texts.huge]}>
        {t('Entrega')} {order.destination.address}
      </Text>
      <Button title={t('Aceitar')} onPress={acceptHandler} />
      <Button title={t('Recusar')} onPress={rejectHandler} />
    </SafeAreaView>
  );
}
