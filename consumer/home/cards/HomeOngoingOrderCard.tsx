import { Order } from 'appjusto-types';
import React from 'react';
import { Image, Text, View } from 'react-native';

import * as icons from '../../../assets/icons';
import PaddedView from '../../../common/components/containers/PaddedView';
import { borders, colors, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

type Props = {
  order: Order;
};

export default function ({ order }: Props) {
  // UI
  let detail = '';
  if (order.dispatchingState === 'going-pickup') {
    detail = `${t('À caminho de')} ${order.origin.address.main}`;
  } else if (order.dispatchingState === 'arrived-pickup') {
    detail = order.origin.intructions ?? 'Aguardando retirada';
  } else if (order.dispatchingState === 'going-destination') {
    detail = `${t('À caminho de')} ${order.destination.address.main}`;
  } else if (order.dispatchingState === 'arrived-destination') {
    detail = order.destination.intructions ?? 'Aguardando entrega';
  }
  return (
    <PaddedView
      style={{
        ...borders.default,
        backgroundColor: colors.yellow,
      }}
      half
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={icons.requests} />
        <View style={{ marginLeft: padding }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View>
              <Text style={{ ...texts.default }}>{t('Pedido em andamento')}</Text>
              <Text style={{ ...texts.small, color: colors.black }}>{detail}</Text>
            </View>
          </View>
        </View>
      </View>
    </PaddedView>
  );
}
