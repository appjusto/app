import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../../common/app/context';
import { getConsumer } from '../../../../../common/store/consumer/selectors';
import { useContextActiveOrder } from '../../../../../common/store/context/order';
import { isConsumerProfileComplete } from '../../../../../common/store/courier/validators';
import { showToast } from '../../../../../common/store/ui/actions';
import { colors, screens } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { OrderSummary } from '../../../common/order-summary/OrderSummary';
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
  const [confirmedDestination, setConfirmedDestination] = React.useState(false);
  const [orderAdditionalInfo, setOrderAdditionalInfo] = React.useState('');
  const [cpf, setCpf] = React.useState(consumer.cpf ?? '');
  const [wantsCpf, setWantsCpf] = React.useState(false);
  const [shareDataWithBusiness, setShareDataWithBusiness] = React.useState(false);

  // side effects
  // whenever route changes when interacting with other screens
  React.useEffect(() => {
    if (params?.destination) {
      if (order) {
        api.order().updateOrder(order.id, { destination: params.destination });
        setConfirmedDestination(true);
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
  // handlers
  const placeOrderHandler = async (fleetId: string) => {
    if (!order) return;
    if (!selectedPaymentMethodId) return;
    if (!confirmedDestination) {
      setDestinationModalVisible(true);
      return;
    }
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
      dispatch(showToast(t('CPF preenchido incorretamente. Por favor confira novamente'), 'error'));
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
  // navigate to FleetDetail
  const navigateFleetDetail = (fleetId: string) => {
    navigation.navigate('FleetDetail', { fleetId });
  };
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
      keyboardShouldPersistTaps="never"
    >
      <OrderSummary
        activityIndicator={isLoading}
        order={order}
        selectedPaymentMethodId={selectedPaymentMethodId}
        waiting={isLoading}
        showMap={Boolean(order.route)}
        onEditStep={() => {
          navigation.navigate('OrderDestination', {
            returnScreen: 'FoodOrderCheckout',
            returnParam: 'destination',
          });
        }}
        onEditItemPress={(productId, itemId) => {
          navigation.navigate('ItemDetail', { productId, itemId });
        }}
        onAddItemsPress={() => navigation.navigate('RestaurantDetail')}
        placeOrder={placeOrderHandler}
        navigateToFillPaymentInfo={navigateToFillPaymentInfo}
        navigateFleetDetail={navigateFleetDetail}
        navigateToPixPayment={(total, fleetId) =>
          navigation.navigate('PayWithPix', { orderId: order.id!, total, fleetId })
        }
        navigateToAboutCharges={() => navigation.navigate('AboutCharges')}
        additionalInfo={orderAdditionalInfo}
        onAddInfo={(text) => setOrderAdditionalInfo(text)}
        wantsCpf={wantsCpf}
        onSwitchValueChange={() => setWantsCpf(!wantsCpf)}
        cpf={cpf}
        setCpf={(text) => setCpf(text)}
        shareDataWithBusiness={shareDataWithBusiness}
        onShareData={() => setShareDataWithBusiness(!shareDataWithBusiness)}
      />
      <DestinationModal
        modalVisible={destinationModalVisible}
        onModalClose={() => {
          setDestinationModalVisible(false);
        }}
        onConfirmAddress={() => {
          setDestinationModalVisible(false);
          setConfirmedDestination(true);
        }}
        order={order}
        onEditAddress={() => {
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
