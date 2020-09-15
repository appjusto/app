import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useCallback, useMemo, useEffect } from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';

import * as icons from '../../../assets/icons';
import { AppDispatch, ApiContext } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import RoundedText from '../../../common/components/texts/RoundedText';
import PaddedView from '../../../common/components/views/PaddedView';
import { nextDispatchingState, completeDelivery } from '../../../common/store/order/actions';
import { getOrderById } from '../../../common/store/order/selectors';
import { getUIBusy } from '../../../common/store/ui/selectors';
import { colors, screens, texts } from '../../../common/styles';
import OrderMap from '../../../consumer/home/orders/p2p-order/OrderMap';
import { t } from '../../../strings';
import { DeliveriesNavigatorParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<DeliveriesNavigatorParamList, 'OngoingDelivery'>;
type ScreenRoute = RouteProp<DeliveriesNavigatorParamList, 'OngoingDelivery'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export default function ({ navigation, route }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const { orderId } = route.params;

  // app state
  const busy = useSelector(getUIBusy);
  const order = useSelector(getOrderById)(orderId);

  useEffect(() => {
    if (order.status === 'delivered') {
      navigation.navigate('DeliverySummary', { orderId });
    }
  }, [order]);

  // handlers
  const nextStatepHandler = useCallback(async () => {
    if (order.dispatchingState !== 'arrived-destination') {
      dispatch(nextDispatchingState(api)(order.id!));
    } else {
      dispatch(completeDelivery(api)(order.id!));
    }
  }, [order]);

  const openChatHandler = useCallback(() => {
    navigation.navigate('Chat', { orderId });
  }, [order]);

  // UI
  const nextStepLabel = useMemo(() => {
    if (order.dispatchingState === 'going-pickup') {
      return t('Cheguei no local de retirada');
    } else if (order.dispatchingState === 'arrived-pickup') {
      return t('Sai para a entrega');
    } else if (order.dispatchingState === 'going-destination') {
      return t('Cheguei no local de entrega');
    } else if (order.dispatchingState === 'arrived-destination') {
      return t('Finalizar entrega');
    }
    return '';
  }, [order]);

  return (
    <View style={{ ...screens.default }}>
      <View style={{ flex: 1 }}>
        <OrderMap order={order!} />
      </View>
      <PaddedView style={{ backgroundColor: colors.lightGrey }}>
        <Text style={[texts.small, { color: colors.darkGreen }]}>{t('Pedido de')}</Text>
        <Text style={[texts.medium]}>{order.consumerName}</Text>
        <TouchableOpacity onPress={openChatHandler}>
          <RoundedText leftIcon={icons.chat}>{t('Iniciar chat')}</RoundedText>
        </TouchableOpacity>
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
