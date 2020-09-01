import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useCallback, useMemo } from 'react';
import { View, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { nextDispatchingState, completeDelivery } from '../../../../store/order/actions';
import { getOrderById } from '../../../../store/order/selectors';
import { DispatchingState } from '../../../../store/order/types';
import { getUIBusy } from '../../../../store/ui/selectors';
import { t } from '../../../../strings';
import { AppDispatch, ApiContext } from '../../../app/context';
import DefaultButton from '../../../common/DefaultButton';
import { colors, screens, texts } from '../../../common/styles';
import PaddedView from '../../../common/views/PaddedView';
import OrderMap from '../../../consumer/home/orders/p2p-order/OrderMap';
import { HistoryNavigatorParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<HistoryNavigatorParamList, 'OngoingOrder'>;
type ScreenRoute = RouteProp<HistoryNavigatorParamList, 'OngoingOrder'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export default function ({ navigation, route }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const { orderId } = route.params ?? {};

  // app state
  const busy = useSelector(getUIBusy);
  const order = useSelector(getOrderById)(orderId);

  // handlers
  const nextStatepHandler = useCallback(async () => {
    if (order.dispatchingState !== DispatchingState.ArrivedDestination) {
      dispatch(nextDispatchingState(api)(order.id));
    } else {
      dispatch(completeDelivery(api)(order.id));
    }
  }, [order]);

  const nextStepLabel = useMemo(() => {
    if (order.dispatchingState === DispatchingState.GoingPickUp) {
      return t('Cheguei no local de retirada');
    } else if (order.dispatchingState === DispatchingState.ArrivedPickUp) {
      return t('Sai para a entrega');
    } else if (order.dispatchingState === DispatchingState.GoingDestination) {
      return t('Cheguei no local de entrega');
    } else if (order.dispatchingState === DispatchingState.ArrivedDestination) {
      return t('Finalizar entrega');
    }
    return '';
  }, [order]);

  // UI
  return (
    <View style={{ ...screens.default }}>
      <View style={{ flex: 1 }}>
        <OrderMap order={order!} />
      </View>
      <PaddedView style={{ backgroundColor: colors.lightGrey }}>
        <Text style={[texts.small, { color: colors.darkGreen }]}>{t('Pedido de')}</Text>
        <Text style={[texts.medium]}>{order.consumerName}</Text>
      </PaddedView>
      <PaddedView>
        <Text style={[texts.small, { color: colors.darkGreen }]}>{t('Retirada')}</Text>
        <Text style={[texts.medium]}>{order.origin.address}</Text>
        <Text style={[texts.medium]}>{order.origin.intructions}</Text>

        <DefaultButton
          title={nextStepLabel}
          onPress={nextStatepHandler}
          activityIndicator={busy}
          disabled={busy}
        />
      </PaddedView>
    </View>
  );
}
