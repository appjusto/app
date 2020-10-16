import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

import * as icons from '../../../assets/icons';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import HR from '../../../common/components/views/HR';
import Pill from '../../../common/components/views/Pill';
import OrderCostBreakdown from '../../../common/screens/history/OrderCostBreakdown';
import { getOrderById } from '../../../common/store/order/selectors';
import { colors, padding, screens, texts } from '../../../common/styles';
import { formatCurrency } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { LoggedParamList } from '../../types';
import { HomeNavigatorParamList } from '../types';
import TipControl from './common/TipControl';
import PlaceSummary from './p2p-order/PlaceSummary';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HomeNavigatorParamList, 'OrderDeliveredFeedback'>,
  BottomTabNavigationProp<LoggedParamList>
>;
type ScreenRouteProp = RouteProp<HomeNavigatorParamList, 'OrderDeliveredFeedback'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default ({ navigation, route }: Props) => {
  // context
  const { orderId } = route.params;
  // app state
  const order = useSelector(getOrderById)(orderId)!;
  // UI
  return (
    <View style={{ ...screens.default, paddingVertical: padding }}>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: padding,
            marginTop: padding,
          }}
        >
          <Text style={[texts.big]}>{t('Pedido\nentregue')}</Text>
          <Image source={icons.motocycle} />
        </View>
        <View style={{ paddingHorizontal: padding }}>
          <PlaceSummary place={order.origin} title={t('Retirada')} />
          <PlaceSummary place={order.destination} title={t('Entrega')} />
        </View>
        <HR height={padding} />
        <View>
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
              <Text style={{ ...texts.medium, ...texts.bold }}>
                {formatCurrency(order.fare!.total)}
              </Text>
            </PaddedView>
          </View>
        </View>
        <HR height={padding} />
        <TipControl
          orderId={order.id}
          orderTip={order.tip?.value ?? 0}
          courierId={order.courier!.id}
          courierName={order.courier!.name}
        />
        <View style={{ backgroundColor: colors.white, paddingHorizontal: padding }}>
          <DefaultButton
            title={t('Avaliar entregador')}
            secondary
            style={{ marginBottom: padding }}
            onPress={() => navigation.navigate('ReviewCourier', { courierId: order.courier?.id })}
          />
        </View>
        <HR height={padding} />
        <PaddedView>
          <OrderCostBreakdown order={order} />
        </PaddedView>
        <HR height={padding} />
        <PaddedView>
          {/* <DefaultButton title={t('Finalizar')} onPress={() => navigation.popToTop()} /> */}
          <DefaultButton title={t('Refazer pedido')} onPress={() => {}} />
          <DefaultButton
            title={t('Relatar um problema')}
            onPress={() => {}}
            secondary
            style={{ marginVertical: padding }}
          />
        </PaddedView>
      </ScrollView>
    </View>
  );
};
