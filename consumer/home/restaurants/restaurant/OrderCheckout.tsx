import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Fleet, WithId } from 'appjusto-types';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import { getConsumer } from '../../../../common/store/consumer/selectors';
import { useContextActiveOrder } from '../../../../common/store/context/order';
import { showToast } from '../../../../common/store/ui/actions';
import { colors, screens } from '../../../../common/styles';
import { OrderSummary } from '../../orders/summary/OrderSummary';
import { RestaurantNavigatorParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<RestaurantNavigatorParamList, 'OrderCheckout'>;
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
      api.order().updateFoodOrder(order.id, { destination: route.params.destination });
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
      // navigation.replace('OrderMatching', { orderId });
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
        <ActivityIndicator size="large" color={colors.green} />
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
          navigation.navigate('AddressComplete', {
            returnScreen: 'OrderCheckout',
            returnParam: 'destination',
            value: order.destination,
          });
        }}
        placeOrder={placeOrderHandler}
        navigateToFillPaymentInfo={navigateToFillPaymentInfo}
        navigateFleetDetail={navigateFleetDetail}
      />
    </ScrollView>
  );
};
