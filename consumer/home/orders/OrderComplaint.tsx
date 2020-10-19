import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import DefaultButton from '../../../common/components/buttons/DefaultButton';
import RadioButton from '../../../common/components/buttons/RadioButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { HistoryParamList } from '../../history/types';

type ScreenNavigationProp = StackNavigationProp<HistoryParamList, 'OrderComplaint'>;
type ScreenRouteProp = RouteProp<HistoryParamList, 'OrderComplaint'>;

type Props = {
  route: ScreenRouteProp;
};

export default function ({ route }: Props) {
  //context
  const { order } = route.params;
  //screen state
  const [complaintComment, setComplaintComment] = useState<string>('');
  return (
    <View style={{ ...screens.config }}>
      <PaddedView>
        <Text style={{ ...texts.mediumToBig, marginBottom: padding }}>
          {t('Indique seu problema:')}
        </Text>
        <RadioButton onPress={() => null} title={t('O entregador danificou o meu pedido')} />
        <RadioButton onPress={() => null} title={t('O entregador não fez a entrega')} />
        <RadioButton onPress={() => null} title={t('O entregador foi mal educado')} />
        <RadioButton onPress={() => null} title={t('O entregador demorou mais que o indicado')} />
        <RadioButton onPress={() => null} title={t('Não fiz esse pedido')} />
        <RadioButton onPress={() => null} title={t('A cobrança foi incorreta')} />
        <RadioButton onPress={() => null} title={t('Outro problema')} />
        <Text
          style={{
            ...texts.mediumToBig,
            color: colors.darkGrey,
            marginTop: 24,
            marginBottom: halfPadding,
          }}
        >
          {t('Você pode detalhar mais seu problema')}
        </Text>
        <DefaultInput
          placeholder={t('Escreva sua mensagem')}
          multiline
          numberOfLines={6}
          value={complaintComment}
          onChangeText={setComplaintComment}
        />
      </PaddedView>
      <View style={{ flex: 1 }} />
      <PaddedView style={{ backgroundColor: colors.white }}>
        <DefaultButton title={t('Enviar')} onPress={() => null} />
      </PaddedView>
    </View>
  );
}
