import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import DefaultButton from '../../common/components/buttons/DefaultButton';
import PaddedView from '../../common/components/containers/PaddedView';
import RoundedText from '../../common/components/texts/RoundedText';
import HR from '../../common/components/views/HR';
import Pill from '../../common/components/views/Pill';
import useObserveOrder from '../../common/store/api/order/hooks/useObserveOrder';
import { colors, halfPadding, padding, screens, texts } from '../../common/styles';
import {
  formatCurrency,
  formatDate,
  formatDistance,
  formatDuration,
  separateWithDot,
} from '../../common/utils/formatters';
import { t } from '../../strings';
import TipControl from '../home/orders/common/TipControl';
import OrderMap from '../home/orders/p2p-order/OrderMap';
import PlaceSummary from '../home/orders/p2p-order/PlaceSummary';
import { OrderCostBreakdown } from '../home/orders/summary/breakdown/OrderCostBreakdown';
import { HistoryParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<HistoryParamList, 'OrderDetail'>;
type ScreenRoute = RouteProp<HistoryParamList, 'OrderDetail'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export default function ({ navigation, route }: Props) {
  // context
  const { orderId } = route.params;

  // screen state
  const { order } = useObserveOrder(orderId);

  if (!order) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }

  return (
    <View style={{ ...screens.default }}>
      <ScrollView>
        <View style={{ height: 160 }}>
          <OrderMap order={order} />
        </View>
        <PaddedView>
          <PlaceSummary title={t('Retirada')} place={order.origin} />
          <PlaceSummary title={t('Entrega')} place={order.destination} />
          <View style={{ marginTop: halfPadding }}>
            <RoundedText>
              {separateWithDot(
                formatDistance(order.route?.distance ?? 0),
                formatDuration(order.route?.duration ?? 0)
              )}
            </RoundedText>
          </View>
        </PaddedView>
        <HR height={padding} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pill />
          <PaddedView
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ ...texts.medium, ...texts.bold }}>{t('Total pago')}</Text>
            <Text style={{ ...texts.mediumToBig }}>
              {formatCurrency((order.fare?.consumer.total ?? 0) + (order.tip?.value ?? 0))}
            </Text>
          </PaddedView>
        </View>
        <HR height={padding} />
        <TipControl
          orderId={order.id}
          orderTip={order.tip?.value ?? 0}
          courierId={order.courier!.id}
          courierName={order.courier!.name}
          joined={order.courier?.joined}
        />
        <View style={{ paddingHorizontal: padding, paddingBottom: padding }}>
          <DefaultButton
            title={t('Avaliar o entregador')}
            secondary
            onPress={() =>
              navigation.navigate('ReviewCourier', {
                courierId: order.courier!.id,
                courierName: order.courier!.name,
                courierJoined: formatDate(
                  (order.courier?.joined as firebase.firestore.Timestamp).toDate(),
                  'monthYear'
                ),
                orderId,
              })
            }
          />
        </View>
        <HR height={padding} />
        <PaddedView>
          <OrderCostBreakdown order={order} selectedFare={order.fare} />
        </PaddedView>
        <HR height={padding} />
        <PaddedView>
          <DefaultButton
            title={t('Relatar um problema')}
            onPress={() => navigation.navigate('OrderComplaint', { orderId: order.id })}
            secondary
          />
        </PaddedView>
      </ScrollView>
    </View>
  );
}
