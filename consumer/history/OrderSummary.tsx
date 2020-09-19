import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useSelector } from 'react-redux';

import PaddedView from '../../common/components/containers/PaddedView';
import RoundedText from '../../common/components/texts/RoundedText';
import HR from '../../common/components/views/HR';
import OrderCostBreakdown from '../../common/screens/history/OrderCostBreakdown';
import { getOrderById } from '../../common/store/order/selectors';
import { screens, texts, padding, halfPadding } from '../../common/styles';
import {
  formatDistance,
  formatDuration,
  formatCurrency,
  separateWithDot,
} from '../../common/utils/formatters';
import { t } from '../../strings';
import OrderMap from '../home/orders/p2p-order/OrderMap';
import PlaceSummary from '../home/orders/p2p-order/PlaceSummary';
import { HistoryParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<HistoryParamList, 'OrderSummary'>;
type ScreenRoute = RouteProp<HistoryParamList, 'OrderSummary'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export default function ({ navigation, route }: Props) {
  // context
  const { orderId } = route.params;

  // app state
  const order = useSelector(getOrderById)(orderId);

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
            <Text style={{ ...texts.medium, ...texts.bold }}>{t('Valor pago')}</Text>
            <Text style={{ ...texts.mediumToBig }}>{formatCurrency(order.fare?.total ?? 0)}</Text>
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
