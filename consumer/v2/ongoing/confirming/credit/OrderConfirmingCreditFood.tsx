import { Fulfillment, OrderStatus } from '@appjusto/types';
import React from 'react';
import { Linking } from 'react-native';
import motocycleJson from '../../../../../assets/lottie-icons/motocycle.json';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import { Lottie } from '../../../../../common/components/icons/Lottie';
import FeedbackView from '../../../../../common/components/views/FeedbackView';
import { borders, colors, padding } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { randomConfirmingString } from '../confirmingStrings';

interface Props {
  onCancel: () => void;
  onGoHome: () => void;
  scheduledOrder: boolean;
  fulfillment?: Fulfillment;
  businessPhone?: string;
  status: OrderStatus;
}

export const OrderConfirmingCreditFood = ({
  onCancel,
  onGoHome,
  scheduledOrder,
  fulfillment,
  businessPhone,
  status,
}: Props) => {
  // helpers
  let header = t('Criando seu pedido...');
  let description = t(randomConfirmingString);
  let buttonTitle = t('Cancelar pedido');
  if (status === 'confirmed') {
    header = t('Aguardando aceite do restaurante...');
    description = t('Se demorar, você pode ligar para o restaurante para solicitar o aceite.');
  } else if (scheduledOrder) {
    header = t('Agendando seu pedido...');
    description = t(
      'O restaurante tem até um dia para aceitar o seu pedido, mas a cobrança será efetuada na data de hoje. Mas não se preocupe: caso haja cancelamento, será realizado o estorno do valor.'
    );
    buttonTitle = t('Cancelar agendamento');
  } else if (fulfillment === 'take-away') {
    header = t('Criando seu pedido...');
    description = t(
      'Quando receber o aviso de que seu pedido está pronto, dirija-se ao restaurante para efetuar a retirada.'
    );
    buttonTitle = t('Cancelar pedido');
  }
  return (
    <FeedbackView
      header={header}
      description={description}
      icon={<Lottie animationObject={motocycleJson} iconStyle={{ width: 115, height: 114 }} />}
      background={colors.white}
    >
      {status === 'confirmed' && businessPhone ? (
        <DefaultButton
          style={{
            ...borders.default,
            marginBottom: padding,
            borderColor: colors.black,
            backgroundColor: 'white',
          }}
          title={t('Ligar para o restaurante')}
          onPress={() => Linking.openURL(`tel:${businessPhone}`)}
        />
      ) : null}
      <DefaultButton
        title={buttonTitle}
        onPress={onCancel}
        style={{
          ...borders.default,
          marginBottom: padding,
          borderColor: colors.black,
          backgroundColor: 'white',
        }}
      />
      <DefaultButton title={t('Voltar para o início')} onPress={onGoHome} />
    </FeedbackView>
  );
};
