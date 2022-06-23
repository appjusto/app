import React from 'react';
import motocycleJson from '../../../../../assets/lottie-icons/motocycle.json';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import { Lottie } from '../../../../../common/components/icons/Lottie';
import FeedbackView from '../../../../../common/components/views/FeedbackView';
import { borders, colors, padding } from '../../../../../common/styles';
import { t } from '../../../../../strings';

interface Props {
  onCancel: () => void;
  onGoHome: () => void;
}

export const OrderConfirmingCreditFood = ({ onCancel, onGoHome }: Props) => {
  return (
    <FeedbackView
      header={t('Criando seu pedido...')}
      description={t(
        'Você sabia que o AppJusto não fica com nada do valor da entrega? Ao pedir pelo AppJusto, você ajuda esse entregador a receber mais por seu trabalho. Justo, né?'
      )}
      icon={<Lottie animationObject={motocycleJson} iconStyle={{ width: 115, height: 114 }} />}
      background={colors.white}
    >
      <DefaultButton
        title={t('Cancelar pedido')}
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
