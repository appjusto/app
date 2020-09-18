import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useCallback, useMemo, useEffect } from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';

import * as icons from '../../assets/icons';
import { AppDispatch, ApiContext } from '../../common/app/context';
import DefaultButton from '../../common/components/buttons/DefaultButton';
import PaddedView from '../../common/components/containers/PaddedView';
import RoundedText from '../../common/components/texts/RoundedText';
import { nextDispatchingState, completeDelivery } from '../../common/store/order/actions';
import { getOrderById } from '../../common/store/order/selectors';
import { getUIBusy } from '../../common/store/ui/selectors';
import { colors, screens, texts } from '../../common/styles';
import { t } from '../../strings';
import OrderMap from '../home/orders/p2p-order/OrderMap';
import { HistoryParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<HistoryParamList, 'OngoingOrder'>;
type ScreenRoute = RouteProp<HistoryParamList, 'OngoingOrder'>;

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

  // effects
  useEffect(() => {
    if (order.status === 'delivered') {
      navigation.navigate('OrderSummary', { orderId });
    }
  }, [order]);

  useEffect(() => {
    const { newMessage } = route.params ?? {};
    if (newMessage) {
      openChatHandler();
    }
  }, [route.params]);

  // handlers
  const openChatHandler = useCallback(() => {
    navigation.navigate('Chat', { orderId });
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
        <TouchableOpacity onPress={openChatHandler}>
          <RoundedText leftIcon={icons.chat}>{t('Iniciar chat')}</RoundedText>
        </TouchableOpacity>
      </PaddedView>
      <PaddedView>
        <Text style={[texts.small, { color: colors.darkGreen }]}>{t('Retirada')}</Text>
        <Text style={[texts.medium]}>{order.origin.address?.description}</Text>
        <Text style={[texts.medium]}>{order.origin.intructions}</Text>
      </PaddedView>
    </View>
  );
}
