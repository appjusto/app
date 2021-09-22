import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import PaddedView from '../../../../common/components/containers/PaddedView';
import RoundedText from '../../../../common/components/texts/RoundedText';
import HR from '../../../../common/components/views/HR';
import OrderMap from '../../../../common/screens/orders/OrderMap';
import PlaceSummary from '../../../../common/screens/orders/summary/PlaceSummary';
import { useObserveOrder } from '../../../../common/store/api/order/hooks/useObserveOrder';
import { useSegmentScreen } from '../../../../common/store/api/track';
import { colors, halfPadding, padding, screens, texts } from '../../../../common/styles';
import {
  formatCurrency,
  formatDistance,
  formatDuration,
  separateWithDot,
} from '../../../../common/utils/formatters';
import { OrderCostBreakdown } from '../../../../consumer/v2/common/breakdown/OrderCostBreakdown';
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
  const order = useObserveOrder(orderId);
  // side effects
  // tracking
  useSegmentScreen('Delivery Summary');
  if (!order) {
    // showing the indicator until the order is loaded
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  const fee = (order.fare?.courier.value ?? 0) + (order.tip?.value ?? 0);
  // UI
  return (
    <View style={{ ...screens.default }}>
      <OrderMap order={order} ratio={360 / 160} />
      <ScrollView scrollIndicatorInsets={{ right: 1 }} keyboardShouldPersistTaps="handled">
        <PaddedView>
          <PlaceSummary title={t('Retirada')} place={order.origin!} />
          <PlaceSummary title={t('Entrega')} place={order.destination!} />
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
        <PaddedView>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ ...texts.md, ...texts.bold }}>{t('Valor recebido')}</Text>
            <Text style={{ ...texts.xl }}>{formatCurrency(fee)}</Text>
          </View>
        </PaddedView>
        <HR height={padding} />
        <PaddedView>
          <OrderCostBreakdown order={order} selectedFare={order.fare} hideItems />
        </PaddedView>
      </ScrollView>
    </View>
  );
}
