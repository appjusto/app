import { OrderCancellation } from '@appjusto/types';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useSelector } from 'react-redux';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { IconConeYellow } from '../../../common/icons/icon-cone-yellow';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { useOrderCancellationInfo } from '../../../common/store/api/order/hooks/useOrderCancellationInfo';
import { getFlavor } from '../../../common/store/config/selectors';
import { colors, padding, screens } from '../../../common/styles';
import { formatCurrency } from '../../../common/utils/formatters';
import { OngoingOrderNavigatorParamList } from '../../../consumer/v2/ongoing/types';
import { LoggedNavigatorParamList } from '../../../consumer/v2/types';
import { OngoingDeliveryNavigatorParamList } from '../../../courier/approved/ongoing/types';
import { ApprovedParamList } from '../../../courier/approved/types';
import { t } from '../../../strings';

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
  StackNavigationProp<ApprovedParamList & LoggedNavigatorParamList>
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
  const cancellationInfo = useOrderCancellationInfo(orderId);
  const flavor = useSelector(getFlavor);
  const [cancelInfo, setCancelInfo] = React.useState<OrderCancellation | undefined | null>(
    undefined
  );

  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    if (cancellationInfo) setCancelInfo(cancellationInfo);
    else setCancelInfo(null);
  }, [cancellationInfo, orderId]);
  // UI
  if (!order || cancelInfo === undefined) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  const description = (() => {
    if (flavor === 'courier') {
      if (cancelInfo) {
        if (cancelInfo.params.refund.includes('delivery')) return undefined;
      } else return t('Como você já iniciou o pedido, você receberá: ');
    }
    if (flavor === 'consumer') {
      if (order.type === 'food') {
        return `${t('Esse pedido foi cancelado por')} ${order.business!.name}. ${t(
          'A cobrança será estornada.'
        )}`;
      } else return undefined;
    }
  })();
  const value = (() => {
    if (cancelInfo) {
      if (flavor === 'courier' && !cancelInfo.params.refund.includes('delivery'))
        return formatCurrency(order.fare!.courier.value);
    } else return undefined;
  })();
  return (
    <FeedbackView
      header={
        !cancelInfo
          ? t('Esse pedido foi cancelado')
          : `${t('Esse pedido foi cancelado:')} \n${cancelInfo.issue?.title ?? ''}`
      }
      icon={<IconConeYellow />}
      description={description}
      value={value}
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
