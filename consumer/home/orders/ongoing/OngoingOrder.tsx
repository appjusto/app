import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import RoundedProfileImg from '../../../../common/components/icons/RoundedProfileImg';
import HR from '../../../../common/components/views/HR';
import useNotificationToken from '../../../../common/hooks/useNotificationToken';
import { MessagesCard } from '../../../../common/screens/home/cards/MessagesCard';
import { CourierDistanceBadge } from '../../../../common/screens/orders/ongoing/CourierDistanceBadge';
import CourierStatusHighlight from '../../../../common/screens/orders/ongoing/CourierStatusHighlight';
import { courierNextPlace } from '../../../../common/store/api/order/helpers';
import useObserveOrder from '../../../../common/store/api/order/hooks/useObserveOrder';
import { getConsumer } from '../../../../common/store/consumer/selectors';
import { updateProfile } from '../../../../common/store/user/actions';
import { colors, halfPadding, padding, screens, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import OrderMap from '../p2p-order/OrderMap';
import { OrderNavigatorParamList } from '../types';

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
    if (order?.status === 'delivered') {
      navigation.navigate('OrderDeliveredFeedback', { orderId });
    } else if (order?.dispatchingState === 'matching') {
      // happens when courier cancels the delivery
      navigation.navigate('OrderMatching', { orderId });
    }
  }, [order]);

  // UI
  if (!order) {
    // showing the indicator until the order is loaded
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }
  const nextPlace = courierNextPlace(order);
  const { dispatchingState } = order;
  const addressLabel = (() => {
    if (dispatchingState === 'going-pickup' || dispatchingState === 'going-destination') {
      return t('Retirada em');
    } else if (
      dispatchingState === 'arrived-pickup' ||
      dispatchingState === 'arrived-destination'
    ) {
      return t('Entrega em');
    }
    return '';
  })();
  return (
    <View style={{ ...screens.default }}>
      <View style={{ flex: 1 }}>
        <OrderMap order={order} />
        <CourierStatusHighlight dispatchingState={dispatchingState} />
        <View style={{ paddingHorizontal: padding }}>
          <View
            style={{
              width: '100%',
              marginBottom: padding,
              top: -64,
              alignSelf: 'center',
            }}
          >
            <MessagesCard
              orderId={orderId}
              onPress={() => navigation.navigate('Chat', { orderId })}
            />
          </View>
        </View>
      </View>
      <PaddedView style={{ backgroundColor: colors.white, flexDirection: 'row' }}>
        <RoundedProfileImg flavor="courier" id={order.courier!.id} />
        <View style={{ flex: 1, marginLeft: padding }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[texts.medium]}>{order.courier!.name}</Text>
          </View>
          <Text style={[texts.small, { color: colors.darkGreen }]}>{addressLabel}</Text>
          <Text style={[texts.small]}>{nextPlace?.address.main ?? ''}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <CourierDistanceBadge order={order} />
            <TouchableOpacity
              onPress={() => navigation.navigate('CreateOrderP2P', { orderId: order.id })}
            >
              <Text style={[texts.small, { color: colors.darkGreen }]}>{t('Alterar rota')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </PaddedView>
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
  );
}
