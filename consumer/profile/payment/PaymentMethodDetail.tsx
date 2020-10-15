import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';

import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import LabeledText from '../../../common/components/texts/LabeledText';
import { padding, screens } from '../../../common/styles';
import { t } from '../../../strings';
import { ProfileParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<ProfileParamList, 'ProfilePaymentMethods'>;
type ScreenRouteProp = RouteProp<ProfileParamList, 'ProfilePaymentMethods'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ route }: Props) {
  // const { paymentMethodId } = route.params;

  return (
    <PaddedView style={{ ...screens.config, flex: 1 }}>
      <LabeledText title={t('Número do cartão')}>xxxx xxxx xxxx 1111</LabeledText>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: padding }}>
        <LabeledText title={t('Data de validade')}>09/22</LabeledText>
        <LabeledText title={t('CVV/CVC')}>xxx</LabeledText>
      </View>
      <LabeledText title={t('Nome do titular')} style={{ marginTop: padding }}>
        Nome Sobrenome
      </LabeledText>
      <View style={{ flex: 1 }} />
      <DefaultButton
        style={{ marginTop: padding }}
        title={t('Excluir cartão')}
        onPress={() => {}}
        // disabled={!selectedReason || busy}
        // activityIndicator={busy}
      />
    </PaddedView>
  );
}
