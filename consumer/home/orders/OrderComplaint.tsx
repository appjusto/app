import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import DefaultButton from '../../../common/components/buttons/DefaultButton';
import RadioButton from '../../../common/components/buttons/RadioButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import { OrderComplaintSurvey } from '../../../common/store/user/types';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { HistoryParamList } from '../../history/types';

type ScreenNavigationProp = StackNavigationProp<HistoryParamList, 'OrderComplaint'>;
type ScreenRouteProp = RouteProp<HistoryParamList, 'OrderComplaint'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

export default function ({ route, navigation }: Props) {
  //context
  const { order } = route.params;

  //screen state
  const [complaintComment, setComplaintComment] = useState<string>('');
  //should it be one or another radio button or the consumer can send multiple complaints?
  const [survey, setSurvey] = useState<OrderComplaintSurvey>({
    courierDamagedOrder: false,
    courierDidntDeliver: false,
    courierHasBadManners: false,
    courierLateDelivery: false,
    didntOrderThat: false,
    incorrectBilling: false,
    other: false,
  });

  //handlers (needs async useCallback to register the complaint in the firestore)
  const complaintHandler = () => navigation.popToTop();

  return (
    <View style={{ ...screens.config }}>
      <PaddedView>
        <Text style={{ ...texts.mediumToBig, marginBottom: padding }}>
          {t('Indique seu problema:')}
        </Text>
        <RadioButton
          title={t('O entregador danificou o meu pedido')}
          onPress={() => setSurvey({ ...survey, courierDamagedOrder: !survey.courierDamagedOrder })}
          checked={survey.courierDamagedOrder}
        />
        <RadioButton
          onPress={() => setSurvey({ ...survey, courierDidntDeliver: !survey.courierDidntDeliver })}
          title={t('O entregador não fez a entrega')}
          checked={survey.courierDidntDeliver}
        />
        <RadioButton
          onPress={() =>
            setSurvey({ ...survey, courierHasBadManners: !survey.courierHasBadManners })
          }
          title={t('O entregador foi mal educado')}
          checked={survey.courierHasBadManners}
        />
        <RadioButton
          onPress={() => setSurvey({ ...survey, courierLateDelivery: !survey.courierLateDelivery })}
          title={t('O entregador demorou mais que o indicado')}
          checked={survey.courierLateDelivery}
        />
        <RadioButton
          onPress={() => setSurvey({ ...survey, didntOrderThat: !survey.didntOrderThat })}
          title={t('Não fiz esse pedido')}
          checked={survey.didntOrderThat}
        />
        <RadioButton
          onPress={() => setSurvey({ ...survey, incorrectBilling: !survey.incorrectBilling })}
          title={t('A cobrança foi incorreta')}
          checked={survey.incorrectBilling}
        />
        <RadioButton
          onPress={() => setSurvey({ ...survey, other: !survey.other })}
          title={t('Outro problema')}
          checked={survey.other}
        />
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
        <DefaultButton title={t('Enviar')} onPress={complaintHandler} />
      </PaddedView>
    </View>
  );
}
