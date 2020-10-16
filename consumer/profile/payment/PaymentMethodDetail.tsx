import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';

import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import LabeledText from '../../../common/components/texts/LabeledText';
import { colors, padding, screens } from '../../../common/styles';
import { t } from '../../../strings';
import { ProfileParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<ProfileParamList, 'PaymentMethodDetail'>;
type ScreenRouteProp = RouteProp<ProfileParamList, 'PaymentMethodDetail'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ route }: Props) {
  const { paymentData } = route.params;

  return (
    <PaddedView style={{ ...screens.config, flex: 1 }}>
      <LabeledText title={t('Número do cartão')} disabled>
        {paymentData.data.display_number}
      </LabeledText>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: padding }}>
        <LabeledText title={t('Validade/Mês')} disabled style={{ flex: 1 }}>
          {paymentData.data.month}
        </LabeledText>
        <LabeledText title={t('Validade/Ano')} disabled style={{ flex: 1, marginLeft: padding }}>
          {paymentData.data.year}
        </LabeledText>
      </View>
      <LabeledText title={t('Nome do titular')} style={{ marginTop: padding }} disabled>
      {paymentData.data.holder_name}
      </LabeledText>
      <View style={{ flex: 1 }} />
      <DefaultButton
        style={{
          marginTop: padding,
          backgroundColor: colors.darkGrey,
          borderColor: colors.darkGrey,
        }}
        title={t('Excluir cartão')}
        onPress={() => {}}
        // activityIndicator={busy}
      />
    </PaddedView>
  );
}
