import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useEffect } from 'react';
import { View } from 'react-native';
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
  StackNavigationProp<HomeNavigatorParamList, 'ConfirmCancelOrder'>,
  BottomTabNavigationProp<LoggedParamList>
>;
type ScreenRouteProp = RouteProp<HomeNavigatorParamList, 'ConfirmCancelOrder'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default ({ navigation, route }: Props) => {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const { orderId } = route.params;

  // app state
  const busy = useSelector(getUIBusy);
  const order = useSelector(getOrderById)(orderId);
  const cancellationCharge =
    order.status === 'dispatching' &&
    (order.dispatchingState === 'going-destination' ||
      order.dispatchingState === 'arrived-destination');

  // side effects
  useEffect(() => {
    if (!order) return;
    if (order.status === 'canceled') {
      navigation.popToTop();
    }
  }, [order]);

  // handlers
  const cancelOrderHandler = async () => {
    try {
      await dispatch(actions.cancelOrder(api)(orderId));
    } catch (error) {
      dispatch(showToast(error.toString()));
    }
  };

  // UI
  const description = cancellationCharge
    ? t('Como seu pedido já está a caminho do local de entrega, você não será reembolsado.')
    : t('Como seu pedido ainda não foi pegue, você não será cobrado pelo cancelamento.');
  return (
    <FeedbackView
      header={t('Tem certeza que deseja cancelar o pedido?')}
      description={description}
      icon={icons.coneYellow}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <DefaultButton
          title={t('Cancelar pedido')}
          onPress={cancelOrderHandler}
          activityIndicator={busy}
          disabled={busy}
        />
        <DefaultButton
          style={{
            marginBottom: padding,
          }}
          title={t('Não cancelar')}
          onPress={() => navigation.pop()}
          secondary
        />
      </View>
    </FeedbackView>
  );
};
