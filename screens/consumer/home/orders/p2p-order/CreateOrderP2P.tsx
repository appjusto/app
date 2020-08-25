import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useContext, useEffect } from 'react';
import { View, Image, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { motocycle } from '../../../../../assets/icons';
import { getConsumer } from '../../../../../store/consumer/selectors';
import { createOrder, confirmOrder } from '../../../../../store/order/actions';
import OrderImpl from '../../../../../store/order/types/OrderImpl';
import PlaceImpl from '../../../../../store/order/types/PlaceImpl';
import { showToast } from '../../../../../store/ui/actions';
import { t } from '../../../../../strings';
import { ApiContext, AppDispatch } from '../../../../app/context';
import AvoidingView from '../../../../common/AvoidingView';
import ShowIf from '../../../../common/ShowIf';
import { screens, texts, borders, padding } from '../../../../common/styles';
import { HomeNavigatorParamList } from '../../types';
import OrderMap from './OrderMap';
import OrderPager from './OrderPager';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList, 'CreateOrderP2P'>;
type ScreenRouteProp = RouteProp<HomeNavigatorParamList, 'CreateOrderP2P'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  // app state
  const consumer = useSelector(getConsumer);
  // screen state
  const [origin, setOrigin] = useState(new PlaceImpl({}));
  const [destination, setDestination] = useState(new PlaceImpl({}));
  const [order, setOrder] = useState<OrderImpl | null>(null);
  const [card, setCard] = useState(consumer?.getLastCard() ?? null);

  // side effects
  // route changes when interacting with 'AddressComplete' and 'PaymentSelector' screens;
  useEffect(() => {
    const { origin: newOrigin, destination: newDestination, cardId } = route.params ?? {};
    console.log(newOrigin);
    console.log(newDestination);
    if (newOrigin) setOrigin(origin.merge(newOrigin));
    if (newDestination) setDestination(destination.merge(newDestination));
    if (cardId) setCard(consumer?.getCardById(cardId) ?? null);
  }, [route.params]);

  // create order whenever origin or destination changes
  useEffect(() => {
    if (
      origin.valid() &&
      destination.valid() &&
      (!order ||
        !order.getOrigin().sameAdddress(origin) ||
        !order.getDestination().sameAdddress(destination))
    ) {
      (async () => {
        setOrder(null);
        const newOrder = await dispatch(createOrder(api)(origin.getData(), destination.getData()));
        setOrder(new OrderImpl(newOrder));
      })();
    }
  }, [origin, destination]);

  // handlers
  // navigate to 'AddressComplete' to choose type or choose an address
  const navigateToAddressComplete = (value: string, returnParam: string) => {
    navigation.navigate('AddressComplete', {
      value,
      returnScreen: 'CreateOrderP2P',
      returnParam,
    });
  };
  // navigate to ProfileEdit screen to allow user fill missing information
  const navigateToFillPaymentInfo = () => {
    // if user has no payment method, go direct to 'AddCard' screen
    if (!card) navigation.navigate('ProfileAddCard', { returnScreen: 'CreateOrderP2P' });
    else navigation.navigate('ProfilePaymentMethods', { returnScreen: 'CreateOrderP2P' });
  };
  // confirm order
  const confirmOrderHandler = async () => {
    try {
      const orderId = order!.getData().id;
      await dispatch(confirmOrder(api)(orderId, card!.id));
      navigation.replace('OrderFeedback', { orderId });
    } catch (error) {
      dispatch(showToast(error.toString()));
    }
  };

  // UI
  return (
    <AvoidingView style={{ ...screens.default, justifyContent: 'space-between' }}>
      {/* header */}
      <View style={{ height: 160, justifyContent: 'center', ...borders.default }}>
        {/* when order hasn't been created yet  */}
        <ShowIf test={!order}>
          {() => (
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: padding,
                justifyContent: 'space-between',
                alignItems: 'center',
                ...borders.default,
              }}
            >
              <Text style={{ ...texts.big, ...borders.default }}>{t('Detalhes do\nPedido')}</Text>
              <Image source={motocycle} style={{ width: 114, height: 114 }} />
            </View>
          )}
        </ShowIf>

        {/* after order has been created */}
        <ShowIf test={order?.valid() === true}>{() => <OrderMap order={order!} />}</ShowIf>
      </View>

      {/* pager */}
      <OrderPager
        origin={origin}
        destination={destination}
        order={order}
        card={card}
        navigateToAddressComplete={navigateToAddressComplete}
        navigateToFillPaymentInfo={navigateToFillPaymentInfo}
        confirmOrder={confirmOrderHandler}
      />
    </AvoidingView>
  );
}
