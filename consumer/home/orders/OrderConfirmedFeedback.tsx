import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import * as icons from '../../../assets/icons';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import * as actions from '../../../common/store/order/actions';
import { getOrderById } from '../../../common/store/order/selectors';
import { showToast } from '../../../common/store/ui/actions';
import { getUIBusy } from '../../../common/store/ui/selectors';
import { borders, colors, padding } from '../../../common/styles';
import { t } from '../../../strings';
import { LoggedParamList } from '../../types';
import { HomeNavigatorParamList } from '../types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HomeNavigatorParamList, 'OrderConfirmedFeedback'>,
  BottomTabNavigationProp<LoggedParamList>
>;
type ScreenRouteProp = RouteProp<HomeNavigatorParamList, 'OrderConfirmedFeedback'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default ({ navigation, route }: Props) => {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
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
    }
  }, [order]);

  // handlers
  const cancelOrder = async () => {
    try {
      await dispatch(actions.cancelOrder(api)(orderId));
      navigation.goBack();
    } catch (error) {
      dispatch(showToast(error.toString()));
    }
  };
  const cancelOrderHandler = async () => {
    Alert.alert(t('Cancelar pedido'), t('Tem certeza que deseja cancelar o pedido?'), [
      {
        text: t('Cancelar'),
        style: 'cancel',
      },
      {
        text: t('Confirmar'),
        style: 'destructive',
        onPress: cancelOrder,
      },
    ]);
  };

  // UI
  return (
    <FeedbackView
      header={t('Procurando entregadores...')}
      description={t('A cobrança só será efetuada caso um entregador aceitar o seu pedido.')}
      icon={icons.motocycle}
    >
      <DefaultButton
        title={t('Cancelar pedido')}
        onPress={cancelOrderHandler}
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
    </FeedbackView>
  );
};
