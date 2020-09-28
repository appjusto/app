import { Order } from 'appjusto-types';
import React from 'react';
import { View, Text, Image } from 'react-native';

import * as icons from '../../../../assets/icons';
import PaddedView from '../../../../common/components/containers/PaddedView';
import ShowIf from '../../../../common/components/views/ShowIf';
import useTallerDevice from '../../../../common/hooks/useTallerDevice';
import { texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import OrderMap from './OrderMap';

type Props = {
  order?: Order | null;
};

export default function ({ order }: Props) {
  const tallDevice = useTallerDevice();

  // TODO: what would be the best height?
  if (!tallDevice) return null;

  return (
    <View style={{ height: 160, justifyContent: 'center' }}>
      {/* when order hasn't been created yet  */}
      <ShowIf test={!order}>
        {() => (
          <PaddedView
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            vertical={false}
          >
            <Text style={{ ...texts.big }}>{t('Detalhes do\nPedido')}</Text>
            <Image source={icons.motocycle} style={{ width: 114, height: 114 }} />
          </PaddedView>
        )}
      </ShowIf>

      {/* after order has been created */}
      <ShowIf test={!!order}>{() => <OrderMap order={order!} />}</ShowIf>
    </View>
  );
}
