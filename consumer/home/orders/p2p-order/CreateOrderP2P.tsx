import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Fleet, WithId } from 'appjusto-types';
import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import { getPaymentMethodById } from '../../../../common/store/api/business/consumer/selectors';
import useObserveOrder from '../../../../common/store/api/order/hooks/useObserveOrder';
import { getConsumer } from '../../../../common/store/consumer/selectors';
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
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // redux store
  const consumer = useSelector(getConsumer)!;
  const lastPaymentMethod = getPaymentMethodById(
    consumer,
    consumer.paymentChannel?.mostRecentPaymentMethodId
  );
  // state
  const [orderId, setOrderId] = React.useState<string>();
  const { order } = useObserveOrder(orderId);
  const [paymentMethod, setPaymentMethod] = React.useState(lastPaymentMethod);
  const [isLoading, setLoading] = React.useState(false);

  // side effects
  // route changes when interacting with other screens;
  React.useEffect(() => {
    console.log('CreateOrderP2P useEffect; params: ', route.params);
    // navigation.setParams({});
    (async () => {
      if (route.params?.orderId) setOrderId(route.params?.orderId);
      if (route.params?.origin) {
        if (!order) {
          try {
            setLoading(true);
            const newOrder = await api.order().createOrderP2P(consumer, route.params.origin);
            setLoading(false);
            setOrderId(newOrder.id);
          } catch (error) {
            console.error(error);
            dispatch(showToast(error.toString(), 'error'));
          }
        } else if (orderId) {
          api.order().updateFoodOrder(orderId, { origin: route.params.origin });
        }
      }
      if (orderId && route.params?.destination) {
        api.order().updateFoodOrder(orderId, { destination: route.params.destination });
      }
      if (route.params?.paymentMethodId)
        setPaymentMethod(getPaymentMethodById(consumer, route.params?.paymentMethodId));
    })();
  }, [route.params]);

  // handlers
  // navigate to 'AddressComplete' to enter address
  const navigateToAddressComplete = React.useCallback(
    (value: string, returnParam: string) => {
      navigation.navigate('AddressComplete', {
        value,
        returnScreen: 'CreateOrderP2P',
        returnParam,
      });
    },
    [navigation]
  );
  // navigate to ProfileEdit screen to allow user fill missing information
  const navigateToFillPaymentInfo = React.useCallback(() => {
    // if user has no payment method, go direct to 'AddCard' screen
    if (!paymentMethod) navigation.navigate('ProfileAddCard', { returnScreen: 'CreateOrderP2P' });
    else navigation.navigate('ProfilePaymentMethods', { returnScreen: 'CreateOrderP2P' });
  }, [navigation, paymentMethod]);
  // navigate to fleet detail
  const navigateFleetDetail = React.useCallback((fleet: WithId<Fleet>) => {
    navigation.navigate('FleetDetail', { fleetId: fleet.id });
  }, []);
  // navigate to fleet detail
  const navigateToTransportableItems = React.useCallback(() => {
    navigation.navigate('TransportableItems');
  }, [navigation]);
  // confirm order
  const placeOrderHandler = async (fleetId: string, platformFee: number) => {
    if (!orderId) return;
    if (!paymentMethod) return;
    try {
      setLoading(true);
      await api.order().placeOrder({
        orderId,
        paymentMethodId: paymentMethod.id,
        fleetId,
        platformFee,
      });
      setLoading(false);
      navigation.replace('OrderMatching', { orderId });
    } catch (error) {
      dispatch(showToast(error.toString(), 'error'));
    }
  };

  // UI
  return (
    <View style={{ ...screens.default }}>
      <OrderHeader order={order} />
      <OrderPager
        order={order}
        isLoading={isLoading}
        paymentMethod={paymentMethod}
        navigateToAddressComplete={navigateToAddressComplete}
        navigateToFillPaymentInfo={navigateToFillPaymentInfo}
        navigateFleetDetail={navigateFleetDetail}
        navigateToTransportableItems={navigateToTransportableItems}
        placeOrder={placeOrderHandler}
      />
    </View>
  );
}
