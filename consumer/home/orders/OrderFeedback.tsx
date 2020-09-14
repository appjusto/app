import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as icons from '../../../assets/icons';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { cancelOrder } from '../../../common/store/order/actions';
import { getOrders } from '../../../common/store/order/selectors';
import { showToast } from '../../../common/store/ui/actions';
import { getUIBusy } from '../../../common/store/ui/selectors';
import { borders, colors } from '../../../common/styles';
import { t } from '../../../strings';
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
  const busy = useSelector(getUIBusy);
  const orders = useSelector(getOrders);
  const order = orders.find(({ id }) => id === orderId);

  // side effects
  useEffect(() => {
    if (!order) return;
    if (order.status === 'canceled') {
      navigation.popToTop();
    } else if (order.status === 'dispatching') {
      // TODO: go to the Orders Navigator
    }
  }, [order]);

  // handlers
  const cancelOrderHandler = async () => {
    try {
      await dispatch(cancelOrder(api)(orderId));
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
        activityIndicator={busy}
        disabled={busy}
        style={{ ...borders.default, borderColor: colors.black, backgroundColor: 'white' }}
      />

      <DefaultButton title={t('Voltar para o início')} onPress={() => navigation.popToTop()} />
    </FeedbackView>
  );
};
