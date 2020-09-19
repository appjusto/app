import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Place, Order, WithId } from 'appjusto-types';
import { isEmpty } from 'lodash';
import React, { useState, useContext, useEffect } from 'react';
import { View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { AppDispatch, ApiContext } from '../../../../common/app/context';
import { getConsumer, getCardById } from '../../../../common/store/consumer/selectors';
import { createOrder, confirmOrder, deleteOrder } from '../../../../common/store/order/actions';
import { getOrderById } from '../../../../common/store/order/selectors';
import { placeValid, sameAdddress } from '../../../../common/store/order/validators';
import { showToast } from '../../../../common/store/ui/actions';
import { screens } from '../../../../common/styles';
import { HomeNavigatorParamList } from '../../types';
import OrderHeader from './OrderHeader';
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
  const getOrder = useSelector(getOrderById);
  const cardById = useSelector(getCardById);
  const lastCardId = consumer?.lastCardId;
  const lastCard = !isEmpty(lastCardId) ? cardById(lastCardId!) : undefined;

  // screen state
  const [origin, setOrigin] = useState<Partial<Place>>({});
  const [destination, setDestination] = useState<Partial<Place>>({});
  const [order, setOrder] = useState<WithId<Order>>();
  const [card, setCard] = useState(lastCard);

  // side effects
  // route changes when interacting with other screens;
  useEffect(() => {
    const { orderId, origin: newOrigin, destination: newDestination, cardId } = route.params ?? {};
    if (orderId) setOrder(getOrder(orderId)); // from 'OrderHistory'
    if (newOrigin) setOrigin({ ...origin, address: newOrigin }); // from 'AddressComplete'
    if (newDestination) setDestination({ ...destination, address: newDestination }); // from 'AddressComplete'
    if (cardId) setCard(cardById(cardId)); // from 'PaymentSelector'
  }, [route.params]);

  // to handle `setOrder()` from route changes
  // if origin/destination aren't valid but those from order's are, we suppose that we need to update origin/destination
  useEffect(() => {
    if (!placeValid(origin) && placeValid(order?.origin)) {
      setOrigin(order?.origin!);
    }
    if (!placeValid(destination) && placeValid(order?.destination)) {
      setDestination(order?.destination!);
    }
  }, [order]);

  // create order whenever origin or destination changes
  useEffect(() => {
    // delete previous quote
    if (!placeValid(origin)) return;
    if (!placeValid(destination)) return;
    if (
      !order ||
      !sameAdddress(origin.address!, order.origin.address!) ||
      !sameAdddress(destination.address!, order.destination.address!)
    ) {
      (async () => {
        const newOrder = await dispatch(createOrder(api)(origin, destination));
        // delete previous quote
        if (order) dispatch(deleteOrder(api)(order.id));
        // set new order
        if (newOrder) setOrder(newOrder);
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
  const confirmOrderHandler = async (fleetId: string, platformFee: number) => {
    try {
      const orderId = order!.id!;
      const result = await dispatch(confirmOrder(api)(orderId, card!.id, fleetId, platformFee));
      console.log(result);
      navigation.replace('OrderConfirmedFeedback', { orderId });
    } catch (error) {
      dispatch(showToast(error.toString()));
    }
  };

  // UI
  return (
    <View style={{ ...screens.default }}>
      <OrderHeader order={order} />
      <OrderPager
        origin={origin}
        destination={destination}
        order={order}
        card={card}
        navigateToAddressComplete={navigateToAddressComplete}
        navigateToFillPaymentInfo={navigateToFillPaymentInfo}
        confirmOrder={confirmOrderHandler}
      />
    </View>
  );
}
