import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { IconConeYellow } from '../../../common/icons/icon-cone-yellow';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { colors, padding, screens } from '../../../common/styles';
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
  // UI
  if (!order) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  return (
    <FeedbackView
      header={t('Esse pedido foi cancelado')}
      // header={`${t('Esse pedido foi cancelado pelo')} ${
      //   order!.type === 'food' ? t('restaurante') : t('cliente')
      // }`}
      icon={<IconConeYellow />}
    >
      <SafeAreaView>
        <DefaultButton
          title={t('Voltar para o início')}
          onPress={() => navigation.replace('MainNavigator', { screen: 'Home' })}
          secondary
          style={{ marginBottom: padding }}
        />
      </SafeAreaView>
    </FeedbackView>
  );
};
