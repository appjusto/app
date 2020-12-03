import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import * as icons from '../../../assets/icons';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { getOrderById } from '../../../common/store/order/selectors';
import { getUIBusy } from '../../../common/store/ui/selectors';
import { borders, colors, padding } from '../../../common/styles';
import { t } from '../../../strings';
import { LoggedParamList } from '../../types';
import { HomeNavigatorParamList } from '../types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HomeNavigatorParamList, 'OrderMatching'>,
  BottomTabNavigationProp<LoggedParamList>
>;
type ScreenRouteProp = RouteProp<HomeNavigatorParamList, 'OrderMatching'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default ({ navigation, route }: Props) => {
  // context
  const { orderId } = route.params ?? {};

  // app state
  const busy = useSelector(getUIBusy);
  const order = useSelector(getOrderById)(orderId);

  // side effects
  useEffect(() => {
    if (!order) return;
    if (order.status === 'canceled') {
      navigation.popToTop();
    } else if (order.status === 'dispatching') {
      navigation.replace('OngoingOrder', {
        orderId,
      });
    } else if (order.status === 'unmatched') {
      navigation.navigate('OrderUnmatched', { orderId });
    }
  }, [order]);

  // UI
  return (
    <FeedbackView
      header={t('Procurando entregadores...')}
      description={t('A cobrança só será efetuada caso um entregador aceitar o seu pedido.')}
      icon={icons.motocycle}
    >
      <DefaultButton
        title={t('Cancelar pedido')}
        onPress={() => navigation.navigate('ConfirmCancelOrder', { orderId })}
        activityIndicator={busy}
        disabled={busy}
        style={{
          ...borders.default,
          marginBottom: padding,
          borderColor: colors.black,
          backgroundColor: 'white',
        }}
      />
      <DefaultButton title={t('Voltar para o início')} onPress={() => navigation.popToTop()} />
      {/* testing the new screen */}
      {/* <DefaultButton
        title={t('Nenhum entregador')}
        onPress={() => navigation.navigate('OrderUnmatched', { orderId })}
      /> */}
    </FeedbackView>
  );
};
