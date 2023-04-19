import { Order, WithId } from '@appjusto/types';
import React from 'react';
import { Text, View } from 'react-native';
import PaddedView from '../../../common/components/containers/PaddedView';
import SingleHeader from '../../../common/components/texts/SingleHeader';
import { IconFastFood } from '../../../common/icons/icon-fast-food';
import { useObserveOrderConfirmation } from '../../../common/store/api/order/hooks/useObserveOrderConfirmation';
import { borders, colors, halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

type Props = {
  order: WithId<Order> | null | undefined;
};

export const DeliveryConfirmation = ({ order }: Props) => {
  const confirmation = useObserveOrderConfirmation(order?.id);
  if (!order || !confirmation) return null;
  if (order.fulfillment !== 'delivery') return null;
  const deliveredByBusiness = order.fare?.fleet?.createdBy?.flavor === 'business';
  if (deliveredByBusiness) return null;
  return (
    <View style={{ backgroundColor: colors.white, paddingTop: halfPadding, flex: 1 }}>
      <View style={{ flex: 1 }}>
        <SingleHeader title={t('Confirmação da entrega')} />
        <View style={{ paddingTop: halfPadding, paddingHorizontal: padding }}>
          <Text style={{ ...texts.xs, color: colors.grey700 }}>
            {t('O entregador pedirá os 3 primeiros dígitos do seu CPF para confirmar a entrega.')}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: padding,
            flex: 1,
            height: 64,
          }}
        >
          <View
            style={{
              ...borders.default,
              backgroundColor: colors.white,
              borderColor: colors.black,
              borderWidth: 2,
              borderRadius: 32,
            }}
          />
          <Text style={{ ...texts.sm, marginLeft: halfPadding }}>
            {t('Código de confirmação: ')}
          </Text>
          <Text style={{ ...texts.x4l, marginLeft: halfPadding }}>
            {confirmation?.handshakeChallenge}
          </Text>
        </View>
        <PaddedView style={{ backgroundColor: colors.grey50, flex: 1 }}>
          <View style={{ flexDirection: 'row' }}>
            <IconFastFood />
            <View style={{ marginLeft: padding, width: '75%' }}>
              <Text style={{ ...texts.sm }}>
                {t('Lembre-se: o entregador não deve cobrar nada ao entregar seu pedido')}
              </Text>
              <Text style={{ ...texts.xs, marginTop: halfPadding, color: colors.grey700 }}>
                {t(
                  'Não é necessário nenhum pagamento adicional no momento da entrega. Se isso acontecer, relate o problema para nós.'
                )}
              </Text>
            </View>
          </View>
        </PaddedView>
      </View>
    </View>
  );
};
