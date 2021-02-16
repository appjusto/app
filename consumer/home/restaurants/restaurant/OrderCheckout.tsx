import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Fleet, WithId } from 'appjusto-types';
import React from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import { getConsumer } from '../../../../common/store/consumer/selectors';
import { useContextActiveOrder } from '../../../../common/store/context/order';
import { showToast } from '../../../../common/store/ui/actions';
import { colors, screens } from '../../../../common/styles';
import { OrderSummary } from '../../orders/summary/OrderSummary';
import { HomeNavigatorParamList } from '../../types';
import { RestaurantsNavigatorParamList } from '../types';
import { RestaurantNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RestaurantNavigatorParamList, 'OrderCheckout'>,
  CompositeNavigationProp<
    StackNavigationProp<RestaurantsNavigatorParamList, 'RestaurantNavigator'>,
    StackNavigationProp<HomeNavigatorParamList, 'Home'>
  >
>;
type ScreenRouteProp = RouteProp<RestaurantNavigatorParamList, 'OrderCheckout'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const OrderCheckout = ({ navigation, route }: Props) => {
  // context
  const api = React.useContext(ApiContext);
  const order = useContextActiveOrder();
  const dispatch = useDispatch<AppDispatch>();
  // redux store
  const consumer = useSelector(getConsumer)!;
  // state
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = React.useState(
    consumer.paymentChannel?.mostRecentPaymentMethodId
  );
  const [isLoading, setLoading] = React.useState(false);
  // side effects
  // whenever route changes when interacting with other screens
  React.useEffect(() => {
    if (order && route.params?.destination) {
      api.order().updateOrder(order.id, { destination: route.params.destination });
    }
    if (route.params?.paymentMethodId) setSelectedPaymentMethodId(route.params?.paymentMethodId);
  }, [route.params]);
  // handlers
  const placeOrderHandler = async (fleetId: string, platformFee: number) => {
    if (!order) return;
    if (!selectedPaymentMethodId) return;
    try {
      setLoading(true);
      await api.order().placeOrder({
        orderId: order.id,
        paymentMethodId: selectedPaymentMethodId,
        fleetId,
        platformFee,
      });
      setLoading(false);
      navigation.replace('OrderNavigator', {
        screen: 'OrderConfirming',
        params: {
          orderId: order.id,
        },
      });
    } catch (error) {
      dispatch(showToast(error.toString(), 'error'));
    }
  };
  // navigate to ProfileAddCard or ProfilePaymentMethods to add or select payment method
  const navigateToFillPaymentInfo = React.useCallback(() => {
    // if user has no payment method, go direct to 'AddCard' screen
    if (!selectedPaymentMethodId) {
      navigation.navigate('ProfileAddCard', { returnScreen: 'OrderCheckout' });
    } else {
      navigation.navigate('ProfilePaymentMethods', { returnScreen: 'OrderCheckout' });
    }
  }, [navigation, selectedPaymentMethodId]);
  // navigate to FleetDetail
  const navigateFleetDetail = React.useCallback((fleet: WithId<Fleet>) => {
    navigation.navigate('FleetDetail', { fleetId: fleet.id });
  }, []);
  // UI
  if (!order) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  return (
    <ScrollView style={{ ...screens.default }}>
      <OrderSummary
        order={order}
        selectedPaymentMethodId={selectedPaymentMethodId}
        waiting={isLoading}
        showMap={false}
        onEditStep={() => {
          navigation.navigate('OrderDestination', {
            returnScreen: 'OrderCheckout',
            returnParam: 'destination',
            value: order.destination ?? null,
          });
        }}
        onEditItemPress={(productId, itemId) =>
          navigation.navigate('ItemDetail', { productId, itemId })
        }
        onAddItemsPress={() => navigation.navigate('RestaurantDetail')}
        placeOrder={placeOrderHandler}
        navigateToFillPaymentInfo={navigateToFillPaymentInfo}
        navigateFleetDetail={navigateFleetDetail}
      />
    </ScrollView>
  );
};
