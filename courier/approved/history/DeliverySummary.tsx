import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import RoundedText from '../../../common/components/texts/RoundedText';
import HR from '../../../common/components/views/HR';
import PaddedView from '../../../common/components/views/PaddedView';
import { getOrderById } from '../../../common/store/order/selectors';
import { screens, texts, padding, halfPadding, colors } from '../../../common/styles';
import { formatDistance, formatDuration, formatCurrency } from '../../../common/utils/formatters';
import OrderMap from '../../../consumer/home/orders/p2p-order/OrderMap';
import PlaceSummary from '../../../consumer/home/orders/p2p-order/PlaceSummary';
import { t } from '../../../strings';
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
              {`${formatDistance(order.distance)} \u25CF ${formatDuration(order.duration)}`}
            </RoundedText>
          </View>
          <View
            style={{
              marginTop: padding,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <Text style={[texts.medium]}>{t('Você recebeu')}</Text>
            <Text style={[texts.mediumToBig]}>{formatCurrency(order.fare?.courierFee ?? 0)}</Text>
          </View>
        </PaddedView>
        <HR />
        <PaddedView>
          <Text style={[texts.mediumToBig]}>{t('Entenda os valores')}</Text>
          <Text style={[texts.small, { color: colors.darkGrey }]}>
            {t('Somos transparentes do início ao fim da entrega')}
          </Text>
          <View style={{ marginTop: padding }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[texts.medium]}>{t('Tarifa')}</Text>
              <Text style={[texts.medium]}>{formatCurrency(order.fare?.courierFee ?? 0)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.priceDetailText}>{t('Gorjeta')}</Text>
              {/* TODO: add tip */}
              <Text style={styles.priceDetailText}>{formatCurrency(0)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.priceDetailText}>{t('Impostos')}</Text>
              <Text style={styles.priceDetailText}>{formatCurrency(order.fare?.taxes ?? 0)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.priceDetailText}>{t('Tarifa financeira')}</Text>
              <Text style={styles.priceDetailText}>
                {formatCurrency(order.fare?.financialFee ?? 0)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.priceDetailText}>{t('App Justo')}</Text>
              <Text style={styles.priceDetailText}>
                {formatCurrency(order.fare?.platformFee ?? 0)}
              </Text>
            </View>
          </View>
        </PaddedView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  priceDetailText: {
    ...texts.medium,
    color: colors.darkGrey,
  },
});
