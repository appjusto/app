import { Fare } from '@appjusto/types';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { isEmpty } from 'lodash';
import React from 'react';
import { ActivityIndicator, Keyboard, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../../common/app/context';
import { track, useSegmentScreen } from '../../../../../common/store/api/track';
import { getConsumer } from '../../../../../common/store/consumer/selectors';
import { useContextActiveOrder } from '../../../../../common/store/context/order';
import { isConsumerProfileComplete } from '../../../../../common/store/courier/validators';
import { showToast } from '../../../../../common/store/ui/actions';
import { colors, screens } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { OrderCostBreakdown } from '../../../common/breakdown/OrderCostBreakdown';
import { OrderAvailableFleets } from '../../../common/order-summary/OrderAvailableFleets';
import { OrderPayment } from '../../../common/order-summary/OrderPayment';
import { OrderSummary } from '../../../common/order-summary/OrderSummary';
import { OrderTotal } from '../../../common/order-summary/OrderTotal';
import { LoggedNavigatorParamList } from '../../../types';
import { FoodOrderNavigatorParamList } from '../../types';
import { RestaurantNavigatorParamList } from '../types';
import { DestinationModal } from './DestinationModal';

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
  // params
  const { params } = route;
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
  const [destinationModalVisible, setDestinationModalVisible] = React.useState(false);
  const [orderAdditionalInfo, setOrderAdditionalInfo] = React.useState('');
  const [cpf, setCpf] = React.useState(consumer.cpf ?? '');
  const [wantsCpf, setWantsCpf] = React.useState(false);
  const [shareDataWithBusiness, setShareDataWithBusiness] = React.useState(false);
  const [quotes, setQuotes] = React.useState<Fare[]>();
  const [selectedFare, setSelectedFare] = React.useState<Fare>();
  const canSubmit = React.useMemo(() => {
    return selectedPaymentMethodId !== undefined && selectedFare !== undefined && !isLoading;
  }, [selectedPaymentMethodId, selectedFare, isLoading]);

  // side effects
  // whenever order changes
  // update quotes
  React.useEffect(() => {
    getOrderQuotesHandler();
  }, [order]);
  // whenever quotes are updated
  // select first fare and subscribe to involved fleets updates
  React.useEffect(() => {
    if (!quotes || isEmpty(quotes)) return;
    setSelectedFare(quotes[0]);
  }, [quotes]);
  // whenever route changes when interacting with other screens
  React.useEffect(() => {
    if (params?.destination) {
      if (order) {
        api.order().updateOrder(order.id, { destination: params.destination });
      }
      navigation.setParams({
        destination: undefined,
      });
    }
    if (params?.paymentMethodId) {
      setSelectedPaymentMethodId(params?.paymentMethodId);
      navigation.setParams({
        paymentMethodId: undefined,
      });
    }
  }, [api, navigation, order, params]);
  // check if order is empty to pop this screen
  React.useEffect(() => {
    if (order?.items?.length === 0) navigation.pop();
  }, [order, navigation]);
  // uploads the consumer name in his first order
  React.useEffect(() => {
    if (!order) return;
    if (consumer.name && consumer.name !== order.consumer.name) {
      api.order().updateOrder(order.id, {
        consumer: {
          ...order.consumer,
          name: consumer.name,
        },
      });
    }
  }, [consumer.name, order, api]);
  // if the order status becomes 'expired'
  React.useEffect(() => {
    if (!order) return;
    if (order.status === 'expired') navigation.navigate('MainNavigator', { screen: 'Home' });
  }, [order, navigation]);
  // tracking
  useSegmentScreen('FoodOrderCheckout');
  // handlers
  const getOrderQuotesHandler = async () => {
    if (!order) return;
    if (!order.origin?.location || !order.route?.distance) {
      if (order.route?.issue) dispatch(showToast(order.route.issue, 'error'));
      return;
    }
    setQuotes(undefined);
    try {
      setQuotes(await api.order().getOrderQuotes(order.id));
    } catch (error) {
      dispatch(showToast(error.toString(), 'error'));
    }
  };
  const placeOrderHandler = async (fleetId: string) => {
    Keyboard.dismiss();
    if (!order) return;
    if (!selectedPaymentMethodId) return;
    if (wantsCpf && !cpf) {
      dispatch(
        showToast(
          t(
            'Preencha o campo com o CPF para que ele seja adicionado na nota. Se não quer adicionar o CPF, desmarque a opção'
          )
        )
      );
      return;
    }
    if (wantsCpf && cpf.length !== 11) {
      dispatch(
        showToast(
          t('CPF preenchido incorretamente. Por favor confira o número do seu documento'),
          'error'
        )
      );
      return;
    }
    try {
      setLoading(true);
      await api.order().placeOrder(
        order.id,
        fleetId,
        {
          payableWith: 'credit_card',
          paymentMethodId: selectedPaymentMethodId,
        },
        wantsCpf,
        orderAdditionalInfo,
        shareDataWithBusiness
      );
      track('consumer placed a food order');
      setLoading(false);
      navigation.replace('OngoingOrderNavigator', {
        screen: 'OngoingOrderConfirming',
        params: {
          orderId: order.id,
        },
      });
    } catch (error) {
      setLoading(false);
      dispatch(showToast(error.toString(), 'error'));
    }
  };
  // navigate to ProfileAddCard or ProfilePaymentMethods to add or select payment method
  const navigateToFillPaymentInfo = React.useCallback(() => {
    track('navigating to add payment method');
    // if user has no payment method, go direct to 'AddCard' screen
    if (!isConsumerProfileComplete(consumer)) {
      const returnScreen = !selectedPaymentMethodId ? 'ProfileAddCard' : 'FoodOrderCheckout';
      navigation.navigate('ProfileEdit', { returnScreen, returnNextScreen: 'FoodOrderCheckout' });
    } else if (!selectedPaymentMethodId) {
      navigation.navigate('ProfileAddCard', { returnScreen: 'FoodOrderCheckout' });
    } else {
      navigation.navigate('ProfilePaymentMethods', { returnScreen: 'FoodOrderCheckout' });
    }
  }, [consumer, navigation, selectedPaymentMethodId]);
  // UI
  if (!order) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  return (
    <KeyboardAwareScrollView
      style={{ ...screens.default }}
      scrollIndicatorInsets={{ right: 1 }}
      enableOnAndroid
      enableAutomaticScroll
      keyboardOpeningTime={0}
      keyboardShouldPersistTaps="handled"
    >
      <OrderSummary
        order={order}
        showMap={Boolean(order.route)}
        onEditStep={() => {
          track('consumer changed destination');
          navigation.navigate('OrderDestination', {
            returnScreen: 'FoodOrderCheckout',
            returnParam: 'destination',
          });
        }}
        onEditItemPress={(productId, itemId) => {
          track('editing items in order');
          navigation.navigate('ItemDetail', { productId, itemId });
        }}
        onAddItemsPress={() => {
          track('consumer is going to add more items to the order');
          navigation.navigate('RestaurantDetail');
        }}
        additionalInfo={orderAdditionalInfo}
        onAddInfo={(text) => setOrderAdditionalInfo(text)}
        shareDataWithBusiness={shareDataWithBusiness}
        onShareData={() => {
          setShareDataWithBusiness(!shareDataWithBusiness);
          track('consumer changed share data with business preferences');
        }}
        availableFleets={
          <OrderAvailableFleets
            quotes={quotes}
            selectedFare={selectedFare}
            onFareSelect={(fare) => {
              setSelectedFare(fare);
              track('consumer selected fare');
            }}
            onFleetSelect={(fleetId: string) => {
              track('navigating to view fleet details');
              navigation.navigate('FleetDetail', { fleetId });
            }}
            onRetry={getOrderQuotesHandler}
            order={order}
          />
        }
        costBreakdown={<OrderCostBreakdown order={order} selectedFare={selectedFare!} />}
        totalCost={
          quotes === undefined ? (
            <View style={screens.centered}>
              <ActivityIndicator size="large" color={colors.green500} />
            </View>
          ) : (
            <OrderTotal
              total={selectedFare?.total ?? 0}
              switchValue={wantsCpf}
              onSwitchValueChange={() => {
                setWantsCpf(!wantsCpf);
                track('consumer changed cpf in invoice preferences');
              }}
              cpf={cpf}
              setCpf={setCpf}
            />
          )
        }
        payment={
          <OrderPayment
            selectedPaymentMethodId={selectedPaymentMethodId}
            onEditPaymentMethod={navigateToFillPaymentInfo}
            isSubmitEnabled={canSubmit}
            onSubmit={() => setDestinationModalVisible(true)}
            activityIndicator={isLoading}
            navigateToPixPayment={() => null}
            navigateToAboutCharges={() => {
              track('navigating to AboutCharges');
              navigation.navigate('AboutCharges');
            }}
          />
        }
      />
      <DestinationModal
        activityIndicator={isLoading}
        modalVisible={destinationModalVisible}
        onModalClose={() => {
          setDestinationModalVisible(false);
        }}
        onConfirmAddress={() => placeOrderHandler(selectedFare?.fleet?.id!)}
        order={order}
        onEditAddress={() => {
          track('consumer is changing destination');
          navigation.navigate('OrderDestination', {
            returnScreen: 'FoodOrderCheckout',
            returnParam: 'destination',
          });
          setDestinationModalVisible(false);
        }}
      />
    </KeyboardAwareScrollView>
  );
};
