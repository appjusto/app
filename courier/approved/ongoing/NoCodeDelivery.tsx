import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { motocycle } from '../../../assets/icons';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import RadioButton from '../../../common/components/buttons/RadioButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import { padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';
import { OngoingParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingParamList, 'NoCodeDelivery'>,
  StackNavigationProp<ApprovedParamList>
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export const NoCodeDelivery = ({ navigation }: Props) => {
  const reasons = [
    { title: t('Entregue na portaria'), id: '1' },
    { title: t('Entregue para outra pessoa'), id: '2' },
    { title: t('Cliente não sabia informar o código'), id: '3' },
    { title: t('Cliente não quis informar o código'), id: '4' },
  ];

  // screen state
  const [selectedReason, setSelectedReason] = React.useState();

  return (
    <PaddedView style={{ ...screens.config }}>
      <View style={{ height: 114, width: 114, marginTop: 80, marginBottom: padding }}>
        <Image source={motocycle} />
      </View>
      <Text style={{ ...texts.big }}>{t('Escolha o motivo da confirmação sem código:')}</Text>
      <View style={{ marginTop: padding }}>
        {reasons.map((reason) => (
          <RadioButton
            key={reason.id}
            title={reason.title}
            onPress={() => setSelectedReason(reason)}
            checked={selectedReason?.id === reason.id}
          />
        ))}
      </View>
      <View style={{ flex: 1 }} />
      <DefaultButton
        title={t('Confirmar entrega')}
        onPress={() => navigation.navigate('OngoingDelivery', { noCode: true })}
      />
    </PaddedView>
  );
};
