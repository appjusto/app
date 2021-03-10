import { Order } from 'appjusto-types';
import React from 'react';
import { Text, View } from 'react-native';
import PaddedView from '../../../common/components/containers/PaddedView';
import ShowIf from '../../../common/components/views/ShowIf';
import useTallerDevice from '../../../common/hooks/useTallerDevice';
import { IconMotocycle } from '../../../common/icons/icon-motocycle';
import { colors, halfPadding, texts } from '../../../common/styles';
import { t } from '../../../strings';
import OrderMap from '../common/OrderMap';

type Props = {
  order?: Order;
};

export const P2POrderHeader = ({ order }: Props) => {
  const tallDevice = useTallerDevice();
  const canChangeRoute =
    order?.dispatchingState === 'going-pickup' ||
    order?.dispatchingState === 'arrived-pickup' ||
    order?.dispatchingState === 'going-destination';

  // TODO: what would be the best height?
  if (!tallDevice) return null;

  return (
    <View style={{ height: 160, justifyContent: 'center' }}>
      {/* when order hasn't been created yet  */}
      <ShowIf test={!order?.route}>
        {() => (
          <PaddedView
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            vertical={false}
          >
            <Text style={{ ...texts.x2l }}>{t('Detalhes do\nPedido')}</Text>
            <IconMotocycle />
          </PaddedView>
        )}
      </ShowIf>
      {/* when consumer is changing order's route */}
      <ShowIf test={canChangeRoute}>
        {() => (
          <PaddedView
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              // flex: 1,
            }}
            vertical={false}
          >
            <View style={{ flex: 3 }}>
              <Text style={{ ...texts.x2l, marginBottom: halfPadding }}>{t('Alterar rota')}</Text>
              <Text style={{ ...texts.xs, color: colors.red }} numberOfLines={4}>
                {t('Importante: ')}
                <Text style={{ color: colors.grey700 }}>
                  {t(
                    'alterar locais após o pedido já ter sido confirmado pode resultar em cobranças adicionais'
                  )}
                </Text>
              </Text>
            </View>
            <View style={{ flex: 1 }} />
            <View style={{ flex: 2 }}>
              <IconMotocycle />
            </View>
          </PaddedView>
        )}
      </ShowIf>
      {/* after order has been created */}
      <OrderMap order={order} ratio={360 / 160} />
    </View>
  );
};
