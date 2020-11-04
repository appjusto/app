import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';

import * as icons from '../../../assets/icons';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import HorizontalSelect, {
  HorizontalSelectItem,
} from '../../../common/components/buttons/HorizontalSelect';
import PaddedView from '../../../common/components/containers/PaddedView';
import { colors, padding, screens, texts } from '../../../common/styles';
import { formatCurrency } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { OngoingParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<OngoingParamList, 'DeliveryCompleted'>;
type ScreenRoute = RouteProp<OngoingParamList, 'DeliveryCompleted'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export default function ({ navigation, route }: Props) {
  // context
  const { orderId, fee } = route.params;

  // screen state
  const clientFeedbackData = [
    { title: t('Sim, tudo certo'), id: '1' },
    { title: t('Não, longa espera'), id: '2' },
    { title: t('Não, cliente não apareceu'), id: '3' },
  ];
  const [selectedClientFeedback, setSelectedClientFeedback] = useState<HorizontalSelectItem>();

  // UI
  return (
    <PaddedView style={{ ...screens.default }}>
      <View style={{ marginTop: 24, alignItems: 'center' }}>
        <Image source={icons.motocycle} />
        <Text style={{ ...texts.big, marginVertical: 16 }}>{t('Corrida finalizada!')}</Text>
        <Text style={{ ...texts.default, color: colors.darkGrey }}>{t('Valor recebido')}</Text>
        <Text style={{ ...texts.big, marginTop: 4 }}>{formatCurrency(fee)}</Text>
      </View>
      <View style={{ flex: 1 }} />
      <DefaultButton title={t('Finalizar')} onPress={() => navigation.popToTop()} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: padding,
          marginTop: padding,
        }}
      >
        <DefaultButton title={t('Detalhes da corrida')} secondary onPress={() => {}} />
        <DefaultButton
          title={t('Relatar problema')}
          secondary
          onPress={() => navigation.navigate('CourierDeliveryProblem', { orderId })}
        />
      </View>
    </PaddedView>
  );
}
