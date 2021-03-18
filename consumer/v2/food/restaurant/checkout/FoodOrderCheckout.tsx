import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Fleet, WithId } from 'appjusto-types';
import React from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../../common/app/context';
import { getConsumer } from '../../../../../common/store/consumer/selectors';
import { useContextActiveOrder } from '../../../../../common/store/context/order';
import { showToast } from '../../../../../common/store/ui/actions';
import { colors, screens } from '../../../../../common/styles';
import { OrderSummary } from '../../../common/order-summary/OrderSummary';
import { LoggedNavigatorParamList } from '../../../types';
import { FoodOrderNavigatorParamList } from '../../types';
import { RestaurantNavigatorParamList } from '../types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RestaurantNavigatorParamList, 'FoodOrderCheckout'>,
  CompositeNavigationProp<
    StackNavigationProp<FoodOrderNavigatorParamList, 'RestaurantNavigator'>,
    StackNavigationProp<LoggedNavigatorParamList>
  >
>;
type ScreenRouteProp = RouteProp<RestaurantNavigatorParamList, 'FoodOrderCheckout'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const FoodOrderCheckout = ({ navigation, route }: Props) => {
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
  const [visible, setVisible] = React.useState(false);
  // side effects
  // whenever route changes when interacting with other screens
  React.useEffect(() => {
    if (order && route.params?.destination) {
      api.order().updateOrder(order.id, { destination: route.params.destination });
    }
    if (route.params?.paymentMethodId) setSelectedPaymentMethodId(route.params?.paymentMethodId);
  }, [api, order, route.params]);
  // check if order is empty to pop this screen
  React.useEffect(() => {
    if (order?.items?.length === 0) navigation.pop();
  }, [order, navigation]);
  // handlers
  const placeOrderHandler = async (fleetId: string) => {
    if (!order) return;
    if (!selectedPaymentMethodId) return;
    try {
      setLoading(true);
      await api.order().placeOrder({
        orderId: order.id,
        payableWith: 'credit_card',
        paymentMethodId: selectedPaymentMethodId,
        fleetId,
      });
      setLoading(false);
      navigation.replace('OngoingOrderNavigator', {
        screen: 'OngoingOrderConfirming',
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
  const navigateFleetDetail = React.useCallback(
    (fleet: WithId<Fleet>) => {
      navigation.navigate('FleetDetail', { fleetId: fleet.id });
    },
    [navigation]
  );
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
        showMap
        onEditStep={() => {
          navigation.navigate('OrderDestination', {
            returnScreen: 'OrderCheckout',
            returnParam: 'destination',
            value: order.destination ?? null,
          });
        }}
        onEditItemPress={(productId, itemId) => {
          navigation.navigate('ItemDetail', { productId, itemId });
          setVisible(false);
        }}
        onAddItemsPress={() => navigation.navigate('RestaurantDetail')}
        placeOrder={placeOrderHandler}
        navigateToFillPaymentInfo={navigateToFillPaymentInfo}
        navigateFleetDetail={navigateFleetDetail}
        modalVisible={visible}
        onOpenModal={() => setVisible(!visible)}
        navigateToPixPayment={(total, fleetId) =>
          navigation.navigate('PayWithPix', { orderId: order.id!, total, fleetId })
        }
        navigateToFinishProfile={() =>
          navigation.navigate('ProfileNavigator', { screen: 'ProfileEdit' })
        }
      />
    </ScrollView>
  );
};
