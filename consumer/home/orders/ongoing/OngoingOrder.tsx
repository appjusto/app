import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import HR from '../../../../common/components/views/HR';
import useNotificationToken from '../../../../common/hooks/useNotificationToken';
import { courierNextPlace } from '../../../../common/store/api/order/helpers';
import useObserveOrder from '../../../../common/store/api/order/hooks/useObserveOrder';
import { getConsumer } from '../../../../common/store/consumer/selectors';
import { updateProfile } from '../../../../common/store/user/actions';
import { colors, halfPadding, padding, screens, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { DeliveredItems } from '../components/DeliveredItems';
import { DeliveryInfo } from '../components/DeliveryInfo';
import { StatusAndMessages } from '../components/StatusAndMessages';
import OrderMap from '../p2p-order/OrderMap';
import { OrderNavigatorParamList } from '../types';
import { OngoingOrderStatus } from './OngoingOrderStatus';

type ScreenNavigationProp = StackNavigationProp<OrderNavigatorParamList, 'OngoingOrder'>;
type ScreenRoute = RouteProp<OrderNavigatorParamList, 'OngoingOrder'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export default function ({ navigation, route }: Props) {
  // params
  const { orderId, newMessage } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // app state
  const consumer = useSelector(getConsumer);
  // screen state
  const { order } = useObserveOrder(orderId);
  const [notificationToken, shouldDeleteToken, shouldUpdateToken] = useNotificationToken(
    consumer!.notificationToken
  );

  // side effects
  // whenever params changes
  // open chat if there's a new message
  React.useEffect(() => {
    if (newMessage) {
      setTimeout(() => {
        navigation.setParams({ newMessage: false });
        navigation.navigate('Chat', { orderId });
      }, 100);
    }
  }, [newMessage]);
  // whenever notification token needs to be updated
  React.useEffect(() => {
    if (shouldDeleteToken || shouldUpdateToken) {
      const token = shouldUpdateToken ? notificationToken : null;
      dispatch(updateProfile(api)(consumer!.id, { notificationToken: token }));
    }
  }, [notificationToken, shouldDeleteToken, shouldUpdateToken]);
  // whenever order changes
  // check status to navigate to other screens
  React.useEffect(() => {
    if (!order) return;
    if (order.status === 'delivered') {
      navigation.navigate('OrderDeliveredFeedback', { orderId });
    } else if (order.dispatchingState === 'no-match') {
      navigation.navigate('OrderNoMatch', { orderId });
    }
  }, [order]);

  // UI
  // showing the indicator until the order is loaded
  if (!order) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  // ongoing UI
  const nextPlace = courierNextPlace(order);
  const { dispatchingState } = order;
  const addressLabel = (() => {
    if (dispatchingState === 'going-pickup') {
      return t('Retirada em');
    } else if (
      dispatchingState === 'arrived-pickup' ||
      dispatchingState === 'arrived-destination' ||
      dispatchingState === 'going-destination'
    ) {
      return t('Entrega em');
    }
    return '';
  })();
  return (
    <View style={{ ...screens.default, paddingBottom: padding }}>
      <ScrollView>
        {order.type === 'p2p' ? (
          <View>
            <View>
              <OrderMap order={order} ratio={0.8} />
              <StatusAndMessages
                dispatchingState={dispatchingState}
                orderId={orderId}
                onMessageReceived={() => navigation.navigate('Chat', { orderId })}
              />
            </View>
            <DeliveryInfo
              order={order}
              addressLabel={addressLabel}
              nextPlace={nextPlace}
              onChangeRoute={() => navigation.navigate('CreateOrderP2P', { orderId: order.id })}
            />
            <HR />
            <PaddedView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 7 }}>
                <DefaultButton
                  title={t('Abrir chat')}
                  onPress={() => navigation.navigate('Chat', { orderId })}
                />
              </View>
              <View style={{ flex: 7, marginLeft: halfPadding }}>
                <DefaultButton
                  title={t('Mais informações')}
                  onPress={() =>
                    navigation.navigate('CourierDetail', {
                      orderId,
                    })
                  }
                  secondary
                />
              </View>
            </PaddedView>
          </View>
        ) : (
          <View>
            <OngoingOrderStatus order={order} />
            {order.status === 'dispatching' ? (
              <View>
                <View>
                  <OrderMap order={order} ratio={1.2} />
                  <StatusAndMessages
                    dispatchingState={dispatchingState}
                    orderId={orderId}
                    onMessageReceived={() => navigation.navigate('Chat', { orderId })}
                  />
                </View>
                <DeliveryInfo
                  order={order}
                  addressLabel={addressLabel}
                  nextPlace={nextPlace}
                  onChangeRoute={() => navigation.navigate('CreateOrderP2P', { orderId: order.id })}
                />
                <HR height={padding} />
                <DeliveredItems order={order} />
              </View>
            ) : (
              <View>
                <HR height={padding} />
                <DeliveredItems order={order} />
                <HR height={padding} />
                <PaddedView
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <View>
                    <Text style={[texts.xs, { color: colors.green600 }]}>{t('Entregar em')}</Text>
                    <Text style={[texts.xs]}>{order.destination?.address.main ?? ''}</Text>
                    <Text style={{ ...texts.xs, color: colors.grey700 }}>
                      {order.destination?.additionalInfo ?? ''}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => null}>
                    <Text style={[texts.xs, { color: colors.green600 }]}>{t('Alterar')}</Text>
                  </TouchableOpacity>
                </PaddedView>
                <HR height={padding} />
                <PaddedView style={{ justifyContent: 'space-between' }}>
                  <View style={{ flex: 7 }}>
                    <DefaultButton title={t('Cancelar pedido')} onPress={() => null} secondary />
                  </View>
                  <View style={{ flex: 7, marginLeft: halfPadding }}>
                    <DefaultButton title={t('Abrir chat com o restaurante')} onPress={() => null} />
                  </View>
                </PaddedView>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
