import { Order } from '@appjusto/types';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { Text, View, ViewProps } from 'react-native';
import RoundedProfileImg from '../../../common/components/icons/RoundedProfileImg';
import SingleHeader from '../../../common/components/texts/SingleHeader';
import OrderMap from '../../../common/screens/orders/OrderMap';
import { colors, halfPadding, padding, texts } from '../../../common/styles';
import { formatDate } from '../../../common/utils/formatters';
import { t } from '../../../strings';

interface Props extends ViewProps {
  order: Order;
}

export const OrderDispatchingMap = ({ order, style }: Props) => {
  if (!order) return null;
  const { dispatchingStatus, courier, status } = order;
  // commented while testing
  // if (status !== 'dispatching') return null;
  const dispatchingMapUI = () => {
    if (dispatchingStatus !== 'outsourced') {
      return (
        <View>
          <SingleHeader title={t('Entregador')} />
          <View
            style={{
              marginTop: halfPadding,
              flexDirection: 'row',
              paddingHorizontal: padding,
              alignItems: 'center',
            }}
          >
            <RoundedProfileImg flavor="courier" id={order.courier?.id} size={48} />
            <View style={{ marginLeft: padding }}>
              <Text style={{ ...texts.xl }}>{order.courier?.name}</Text>
              {order.courier?.joined ? (
                <Text style={{ ...texts.sm, color: colors.grey700, marginTop: 2 }}>
                  {t('No appJusto desde')}{' '}
                  {formatDate((order.courier?.joined as Timestamp).toDate(), 'monthYear')}
                </Text>
              ) : null}
            </View>
          </View>
          <View style={{ marginHorizontal: padding, marginTop: 32 }}>
            <OrderMap order={order} ratio={240 / 160} />
          </View>
        </View>
      );
    } else {
      if (courier?.name) {
        return (
          <View>
            <SingleHeader title={t('Entregador')} />
            <View
              style={{
                marginTop: halfPadding,
                flexDirection: 'row',
                paddingHorizontal: padding,
                alignItems: 'center',
              }}
            >
              <RoundedProfileImg flavor="courier" size={48} />
              <View style={{ marginLeft: padding }}>
                <Text style={{ ...texts.xl }}>{order.courier?.name}</Text>
                <Text style={{ ...texts.sm, color: colors.grey700, marginTop: 2 }}>
                  {t('externo')}
                </Text>
              </View>
            </View>
            <View style={{ marginHorizontal: padding, marginTop: 32 }}>
              <OrderMap order={order} ratio={240 / 160} />
            </View>
          </View>
        );
      } else {
        <View>
          <SingleHeader title={t('Entregador externo')} />
          <View style={{ marginTop: 32 }}>
            <OrderMap order={order} ratio={240 / 160} />
          </View>
        </View>;
      }
    }
  };

  //UI
  return <View style={style}>{dispatchingMapUI()}</View>;
};
