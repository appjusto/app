import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import PaddedView from '../../../../common/components/containers/PaddedView';
import RoundedText from '../../../../common/components/texts/RoundedText';
import HR from '../../../../common/components/views/HR';
import OrderCostBreakdown from '../../../../common/screens/history/OrderCostBreakdown';
import useObserveOrder from '../../../../common/store/api/order/hooks/useObserveOrder';
import { colors, halfPadding, padding, screens, texts } from '../../../../common/styles';
import {
  formatCurrency,
  formatDistance,
  formatDuration,
  separateWithDot,
} from '../../../../common/utils/formatters';
import OrderMap from '../../../../consumer/home/orders/p2p-order/OrderMap';
import PlaceSummary from '../../../../consumer/home/orders/p2p-order/PlaceSummary';
import { t } from '../../../../strings';
import { DeliveriesNavigatorParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<DeliveriesNavigatorParamList, 'DeliverySummary'>;
type ScreenRoute = RouteProp<DeliveriesNavigatorParamList, 'DeliverySummary'>;

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
    // showing the indicator until the order is loaded
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }

  const fee = (order.fare?.courierFee ?? 0) + (order.tip?.value ?? 0);

  return (
    <View style={{ ...screens.default }}>
      <View style={{ height: 160 }}>
        <OrderMap order={order} />
      </View>
      <ScrollView>
        <PaddedView>
          <PlaceSummary title={t('Retirada')} place={order.origin} />
          <PlaceSummary title={t('Entrega')} place={order.destination} />
          <View style={{ marginTop: halfPadding }}>
            <RoundedText>
              {separateWithDot(formatDistance(order.distance), formatDuration(order.duration))}
            </RoundedText>
          </View>
        </PaddedView>
        <HR height={padding} />
        <PaddedView>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ ...texts.medium, ...texts.bold }}>{t('Valor recebido')}</Text>
            <Text style={{ ...texts.mediumToBig }}>{formatCurrency(fee)}</Text>
          </View>
        </PaddedView>
        <HR height={padding} />
        <PaddedView>
          <OrderCostBreakdown order={order} />
        </PaddedView>
      </ScrollView>
    </View>
  );
}
