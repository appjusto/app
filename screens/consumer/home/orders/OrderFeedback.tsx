import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as icons from '../../../../assets/icons';
import { cancelOrder } from '../../../../store/order/actions';
import { getOrders } from '../../../../store/order/selectors';
import { OrderStatus } from '../../../../store/order/types';
import { showToast } from '../../../../store/ui/actions';
import { t } from '../../../../strings';
import { ApiContext, AppDispatch } from '../../../app/context';
import DefaultButton from '../../../common/DefaultButton';
import FeedbackView from '../../../common/FeedbackView';
import { borders, colors } from '../../../common/styles';
import { HomeNavigatorParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList, 'OrderFeedback'>;
type ScreenRouteProp = RouteProp<HomeNavigatorParamList, 'OrderFeedback'>;

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
  const orders = useSelector(getOrders);
  const order = orders.find(({ id }) => id === orderId);

  // state
  const [waiting, setWaiting] = useState(false);

  // side effects
  useEffect(() => {
    if (!order) return;
    if (order.status === OrderStatus.Canceled) {
      navigation.popToTop();
    } else if (order.status === OrderStatus.Dispatching) {
      // TODO: go to the Orders Navigator
    }
  }, [order]);

  // handlers
  const cancelOrderHandler = async () => {
    try {
      setWaiting(true);
      await cancelOrder(api)(orderId);
      setWaiting(false);
    } catch (error) {
      dispatch(showToast(error.toString()));
    }
    navigation.popToTop();
  };

  // UI
  return (
    <FeedbackView
      header={t('Pedido em andamento')}
      description={t('Aguarde enquanto encontramos um entregador para você...')}
      icon={icons.motocycle}
    >
      <DefaultButton
        title={t('Cancelar pedido')}
        onPress={cancelOrderHandler}
        activityIndicator={waiting}
        disabled={waiting}
        style={{ ...borders.default, borderColor: colors.black, backgroundColor: 'white' }}
      />

      <DefaultButton title={t('Voltar para o início')} onPress={() => navigation.popToTop()} />
    </FeedbackView>
  );
};
