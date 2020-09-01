import React from 'react';
import { View, Dimensions, Text, Image } from 'react-native';

import * as icons from '../../../../../assets/icons';
import OrderImpl from '../../../../../store/order/types/OrderImpl';
import { t } from '../../../../../strings';
import ShowIf from '../../../../common/ShowIf';
import { texts } from '../../../../common/styles';
import PaddedView from '../../../../common/views/PaddedView';
import OrderMap from './OrderMap';

type Props = {
  order?: OrderImpl | null;
};

export default function ({ order }: Props) {
  const { height } = Dimensions.get('window');

  // TODO: what would be the best height?
  if (height < 700) return null;

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
      <ShowIf test={order?.valid() === true}>{() => <OrderMap order={order!.getData()} />}</ShowIf>
    </View>
  );
}
