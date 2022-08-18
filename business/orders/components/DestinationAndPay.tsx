import { Order } from '@appjusto/types';
import React from 'react';
import { Text, View, ViewProps } from 'react-native';
import SingleHeader from '../../../common/components/texts/SingleHeader';
import { halfPadding, padding, texts } from '../../../common/styles';
import { formatCurrency } from '../../../common/utils/formatters';
import { t } from '../../../strings';

interface Props extends ViewProps {
  order: Order;
}

export const DestinationAndPay = ({ order, style }: Props) => {
  if (!order) return null;
  return (
    <View style={style}>
      <SingleHeader title={t('Destino do pedido')} />
      <View style={{ marginTop: halfPadding, marginBottom: 32, paddingHorizontal: padding }}>
        <Text style={{ ...texts.md }}>{order.destination?.address.description}</Text>
      </View>
      <SingleHeader title={t('Forma de pagamento')} />
      <View style={{ paddingTop: halfPadding, paddingHorizontal: padding }}>
        <Text style={{ ...texts.md }}>
          {t('Valor do frete: ')}
          <Text style={texts.bold}>
            {order?.fare?.courier?.value ? formatCurrency(order.fare.courier.value) : 'N/E'}
            {order?.outsourcedBy === 'business' && ` (${t('Assumido pelo restaurante')})`}
          </Text>
        </Text>
        <Text style={{ ...texts.md, marginTop: 4 }}>
          {t('Total pago: ')}
          <Text style={texts.bold}>{formatCurrency(order.fare!.total)}</Text>
        </Text>
        {/* for now, this doesn't change */}
        <Text style={{ ...texts.md, marginTop: 4 }}>
          {t('Método de pagamento: ')}
          {order.paymentMethod === 'pix' ? (
            <Text style={texts.bold}>{t('pagamento via app: Pix')}</Text>
          ) : (
            <Text style={texts.bold}>{t('pagamento via app: Cartão de Crédito')}</Text>
          )}
        </Text>
      </View>
    </View>
  );
};
