import { useRoute, useNavigation } from '@react-navigation/native';
import React, { useEffect, useContext, useCallback } from 'react';
import { Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { t } from '../../../strings';
import { ApiContext } from '../../app/context';
import { texts } from '../../common/styles';

export default function () {
  // context
  const navigation = useNavigation();
  const api = useContext(ApiContext);
  const route = useRoute();
  const { params } = route;
  const { data } = params || {};

  // handlers
  const acceptHandler = useCallback(async () => {
    const match = await api.matchOrder(data.orderId);
    console.log(match);
    // TODO: if successful, go to Delivering screen
  }, [data]);

  const rejectHandler = useCallback(() => {
    navigation.goBack();
    // TODO: ask why
  }, [data]);

  // side effects
  useEffect(() => {
    if (!data) navigation.goBack();
  }, []);

  // UI
  if (!data) return null;

  return (
    <SafeAreaView>
      <Text style={[texts.default, { fontSize: 20, lineHeight: 24 }]}>
        {t('Nova corrida para você!')}
      </Text>
      <Text style={[texts.huge]}>
        {t('R$')} {data.fare}
      </Text>
      <Text style={[texts.huge]}>
        {t('Retirada')} {data.origin.address}
      </Text>
      <Text style={[texts.huge]}>
        {t('Entrega')} {data.destination.address}
      </Text>
      <Button title={t('Aceitar')} onPress={acceptHandler} />
      <Button title={t('Recusar')} onPress={rejectHandler} />
    </SafeAreaView>
  );
}
