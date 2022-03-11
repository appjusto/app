import { Order } from '@appjusto/types';
import React from 'react';
import { Text, View, ViewProps } from 'react-native';
import SingleHeader from '../../../common/components/texts/SingleHeader';
import { halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

interface Props extends ViewProps {
  order: Order;
}

export const InfoAndCPF = ({ order, style }: Props) => {
  if (!order) return null;
  // if (!order.additionalInfo && !order.consumer.cpf) return null;
  return (
    <View style={style}>
      <SingleHeader title={t('Observações')} />
      <View style={{ paddingHorizontal: padding, paddingTop: halfPadding }}>
        {/* {order.consumer.cpf ? (
        <Text style={{ ...texts.md, marginBottom: halfPadding }}>
          {t('Incluir CPF na nota, CPF: ')}
          {cpfFormatter(order.consumer.cpf)}
        </Text>
      ) : null} */}
        <Text style={{ ...texts.md, marginBottom: halfPadding }}>
          {t('Incluir CPF na nota, CPF: ')}
          921.642.773-68
        </Text>
        {/* {order.additionalInfo ? (
        <Text style={{ ...texts.md, marginBottom: halfPadding }}>{order.additionalInfo}</Text>
      ) : null} */}
        <Text style={{ ...texts.md, marginBottom: halfPadding }}>
          {t('Favor não misturar os itens na sacola')}
        </Text>
      </View>
    </View>
  );
};
