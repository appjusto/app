import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useSelector } from 'react-redux';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { IconConeYellow } from '../../../common/icons/icon-cone-yellow';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { getFlavor } from '../../../common/store/config/selectors';
import { colors, padding, screens } from '../../../common/styles';
import { formatCurrency } from '../../../common/utils/formatters';
import { OngoingOrderNavigatorParamList } from '../../../consumer/v2/ongoing/types';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';
import { OngoingDeliveryNavigatorParamList } from './types';

export type OrderCanceledParamList = {
  OrderCanceled: {
    orderId: string;
  };
};

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<
    OngoingDeliveryNavigatorParamList & OngoingOrderNavigatorParamList,
    'OrderCanceled'
  >,
  StackNavigationProp<ApprovedParamList>
>;

type ScreenRouteProp = RouteProp<OrderCanceledParamList, 'OrderCanceled'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default ({ navigation, route }: Props) => {
  // params
  const { orderId } = route.params;
  // screen state
  const order = useObserveOrder(orderId);
  const flavor = useSelector(getFlavor);
  // const cancellationInfo = useOrderCancellationInfo(orderId);

  // UI
  if (!order) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  // helpers
  // console.log(cancellationInfo);
  const description =
    flavor === 'courier'
      ? // ? t('Como você já iniciou o pedido, você receberá: ')
        undefined
      : t('Seu pedido foi cancelado pelo restaurante');

  const value = flavor === 'courier' ? formatCurrency(order.fare!.courier.value) : undefined;
  return (
    <FeedbackView
      header={t('Esse pedido foi cancelado')}
      icon={<IconConeYellow />}
      description={description}
      // value={value}
    >
      <View style={{ marginBottom: padding }}>
        <DefaultButton
          title={t('Voltar para o início')}
          onPress={() => navigation.replace('MainNavigator', { screen: 'Home' })}
          secondary
        />
      </View>
    </FeedbackView>
  );
};
