import { Order } from 'appjusto-types';
import React from 'react';
import { Text, View } from 'react-native';
import RoundedText from '../../../../common/components/texts/RoundedText';
import { IconRequest } from '../../../../common/icons/icon-requests';
import { colors, padding, texts } from '../../../../common/styles';
import { formatTime } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';

interface Props {
  order: Order;
}

export const OngoingOrderStatus = ({ order }: Props) => {
  // if (order.type === 'p2p') return null;
  let header = t('Pedido confirmado!');
  let description = t('O restaurante já está com seu pedido e em breve iniciará o preparo.');
  if (order.status === 'preparing') {
    header = t('Pedido em preparo');
    description = t(
      'O restaurante começou a preparar seu pedido e logo estará prontinho para você.'
    );
  } else if (order.status === 'ready') {
    header = t('Pronto para entrega');
    description = t('Estamos aguardando o entregador pegar o seu pedido e levá-lo até você.');
  }
  return (
    <View style={{ padding, alignItems: 'center' }}>
      <IconRequest />
      <Text style={{ marginTop: padding, ...texts.mediumToBig }}>{header}</Text>
      <Text style={{ ...texts.medium, color: colors.darkGrey, textAlign: 'center' }}>
        {description}
      </Text>
      {order.destination?.estimatedTimeOfArrival && (
        <RoundedText style={{ marginTop: padding }}>{`${t('Previsão de entrega: ')} ${formatTime(
          order.destination.estimatedTimeOfArrival
        )}`}</RoundedText>
      )}
    </View>
  );
};
