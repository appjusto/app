import { Fare } from '@appjusto/types';
import * as cpfutils from '@fnando/cpf';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { isEmpty, merge } from 'lodash';
import React from 'react';
import { ActivityIndicator, Keyboard, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../../common/app/context';
import { useModalToastContext } from '../../../../../common/contexts/ModalToastContext';
import { useContextGetSeverTime } from '../../../../../common/contexts/ServerTimeContext';
import useLastKnownLocation from '../../../../../common/location/useLastKnownLocation';
import { useQuotes } from '../../../../../common/store/api/order/hooks/useQuotes';
import { useProfileSummary } from '../../../../../common/store/api/profile/useProfileSummary';
import { track, useSegmentScreen } from '../../../../../common/store/api/track';
import { getConsumer } from '../../../../../common/store/consumer/selectors';
import { isConsumerProfileComplete } from '../../../../../common/store/consumer/validators';
import { useContextActiveOrder } from '../../../../../common/store/context/order';
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
  const getServerTime = useContextGetSeverTime();

  const dispatch = useDispatch<AppDispatch>();
  const { showModalToast } = useModalToastContext();
  // redux store
  const consumer = useSelector(getConsumer)!;
  // state
  const { shouldVerifyPhone } = useProfileSummary();
  const { coords } = useLastKnownLocation();
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = React.useState(
    consumer.paymentChannel?.mostRecentPaymentMethodId
  );
  const [isLoading, setLoading] = React.useState(false);
  const [destinationModalVisible, setDestinationModalVisible] = React.useState(false);
  const [orderAdditionalInfo, setOrderAdditionalInfo] = React.useState('');
  const [cpf, setCpf] = React.useState(consumer.cpf ?? '');
  const [wantsCpf, setWantsCpf] = React.useState(false);
  const [shareDataWithBusiness, setShareDataWithBusiness] = React.useState(false);
  const quotes = useQuotes(order?.id);
  const [selectedFare, setSelectedFare] = React.useState<Fare>();
  const [complement, setComplement] = React.useState<string>(
    order?.destination?.additionalInfo ?? ''
  );
  const [addressComplement, setAddressComplement] = React.useState<boolean>(complement.length > 0);
  // const canNotDeliver = !business?.preparationModes?.includes('realtime');
  // const [preparationMode, setPreparationMode] = React.useState<PreparationMode>(
  //   canNotDeliver ? 'scheduled' : 'realtime'
  // );
  // while preparationModes[] are not added to businesses
  // const [preparationMode, setPreparationMode] = React.useState<PreparationMode>('realtime');
  const canSubmit =
    selectedPaymentMethodId !== undefined &&
    selectedFare !== undefined &&
    !isLoading &&
    isEmpty(order?.route?.issue);
  // side effects
  // whenever quotes are updated
  // select first fare
  React.useEffect(() => {
    if (!quotes || isEmpty(quotes)) return;
    setSelectedFare(quotes[0]);
  }, [quotes]);
  // whenever route changes when interacting with other screens
  React.useEffect(() => {
    if (params?.destination) {
      if (
        order &&
        params.destination.address.description !== order.destination?.address.description
      ) {
        api.order().updateOrder(order.id, { destination: params.destination });
        if (params.destination.additionalInfo) {
          setComplement(params.destination.additionalInfo);
        }
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
    // from AvailableFleets screen
    if (params?.returningFare) {
      setSelectedFare(params.returningFare);
      navigation.setParams({
        returningFare: undefined,
      });
    }
    if (consumer.cpf) setCpf(consumer.cpf);
  }, [api, navigation, order, params, consumer.cpf]);
  // update consumer's name in his first order
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
  // return to Home if order status becomes 'expired' or all items are removed from it
  React.useEffect(() => {
    if (order === undefined) return;
    if (order === null) navigation.goBack();
    if (order?.status === 'expired') {
      navigation.navigate('MainNavigator', { screen: 'Home' });
    }
  }, [order, navigation]);
  // tracking
  useSegmentScreen('FoodOrderCheckout');
  // handlers
  const placeOrderHandler = async () => {
    Keyboard.dismiss();
    if (!order) return;
    if (!selectedFare) return;
    if (!selectedPaymentMethodId) return;
    if (!order.destination?.address) {
      dispatch(
        showToast(
          t(
            'Tivemos um problema... Por favor, refaça o pedido e certifique-se que o endereço de entrega está correto'
          ),
          'error'
        )
      );
      showModalToast(
        t(
          'Tivemos um problema... Por favor, refaça o pedido e certifique-se que o endereço de entrega está correto'
        ),
        'error'
      );
    }
    if (shouldVerifyPhone) {
      navigation.navigate('PhoneVerificationScreen', {
        phone: consumer.phone!,
        countryCode: consumer.countryCode,
        returnScreen: 'FoodOrderCheckout',
      });
      return;
    }
    if (wantsCpf) {
      if (!cpf) {
        dispatch(
          showToast(
            t(
              'Preencha o campo com o CPF para que ele seja adicionado na nota. Se não quer adicionar o CPF, desmarque a opção'
            )
          )
        );
        showModalToast(
          t(
            'Preencha o campo com o CPF para que ele seja adicionado na nota. Se não quer adicionar o CPF, desmarque a opção'
          ),
          'error'
        );
        return;
      } else if (!cpfutils.isValid(cpf)) {
        dispatch(
          showToast(
            t('CPF preenchido incorretamente. Por favor confira o número do seu documento'),
            'error'
          )
        );
        showModalToast(
          t('CPF preenchido incorretamente. Por favor confira o número do seu documento'),
          'error'
        );
        return;
      }
    }
    try {
      setLoading(true);
      if (complement.trim().length === 0) {
        setComplement('');
      }
      if (addressComplement) {
        await api.order().updateOrder(order.id, {
          destination: merge(order.destination, {
            additionalInfo: complement,
          }),
        });
      }
      // updating order with preparationMode
      // await api.order().updateOrder(order.id, {
      //   preparationMode,
      // });
      await api.order().placeOrder(
        order.id,
        selectedFare!.fleet.id,
        {
          payableWith: 'credit_card',
          paymentMethodId: selectedPaymentMethodId,
        },
        wantsCpf,
        coords,
        orderAdditionalInfo,
        shareDataWithBusiness
      );
      track('consumer placed a food order');
      setDestinationModalVisible(false);
      setLoading(false);
      // if (order.preparationMode === 'scheduled') {
      //   navigation.replace('OngoingOrderNavigator', {
      //     screen: 'ScheduledOrderConfirmation',
      //   });
      // }
      //  else
      navigation.replace('OngoingOrderNavigator', {
        screen: 'OngoingOrderConfirming',
        params: {
          orderId: order.id,
        },
      });
    } catch (error: any) {
      setLoading(false);
      Keyboard.dismiss();
      dispatch(showToast(error.toString(), 'error'));
      showModalToast(error.toString(), 'error');
    }
  };
  // navigate to ProfileAddCard or ProfilePaymentMethods to add or select payment method
  const navigateToFillPaymentInfo = React.useCallback(() => {
    // if user has no payment method, go direct to 'AddCard' screen
    if (!isConsumerProfileComplete(consumer)) {
      const returnScreen = !selectedPaymentMethodId ? 'ProfileAddCard' : 'FoodOrderCheckout';
      navigation.navigate('CommonProfileEdit', {
        returnScreen,
        returnNextScreen: 'FoodOrderCheckout',
      });
    } else if (!selectedPaymentMethodId) {
      navigation.navigate('ProfileAddCard', { returnScreen: 'FoodOrderCheckout' });
    } else {
      navigation.navigate('ProfilePaymentMethods', { returnScreen: 'FoodOrderCheckout' });
    }
  }, [consumer, navigation, selectedPaymentMethodId]);

  const navigateToCompleteProfile = () => {
    navigation.navigate('CommonProfileEdit', { returnScreen: 'FoodOrderCheckout' });
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
      keyboardShouldPersistTaps="handled"
    >
      <OrderSummary
        order={order}
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
        onAddItemsPress={() => {
          navigation.navigate('RestaurantDetail');
        }}
        additionalInfo={orderAdditionalInfo}
        onAddInfo={(text) => setOrderAdditionalInfo(text)}
        shareDataWithBusiness={shareDataWithBusiness}
        onShareData={() => {
          setShareDataWithBusiness(!shareDataWithBusiness);
          track('consumer changed share data with business preferences');
        }}
        onCheckSchedules={() => navigation.navigate('ScheduleOrder')}
        orderFulfillment={
          <View>
            <OrderAvailableFleets
              order={order}
              quotes={quotes}
              selectedFare={selectedFare}
              onFareSelect={(fare) => {
                setSelectedFare(fare);
              }}
              onFleetSelect={(fleetId: string) => {
                navigation.navigate('FleetDetail', { fleetId });
              }}
              navigateToAvailableFleets={() =>
                navigation.navigate('AvailableFleets', {
                  orderId: order.id,
                  selectedFare: selectedFare!,
                  returnScreen: 'FoodOrderCheckout',
                })
              }
            />
          </View>
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
            isSubmitEnabled={canSubmit}
            activityIndicator={isLoading}
            onEditPaymentMethod={navigateToFillPaymentInfo}
            onSubmit={() => {
              if (!shouldVerifyPhone) setDestinationModalVisible(true);
              else placeOrderHandler();
            }}
            navigateToAboutCharges={() => {
              navigation.navigate('AboutCharges');
            }}
            navigateToCompleteProfile={navigateToCompleteProfile}
            navigateToSelectPayment={() => navigation.navigate('SelectPaymentMethod')}
            navigateToPayWithPix={() => {
              navigation.navigate('PayWithPix', {
                orderId: order.id,
                fleetId: selectedFare!.fleet!.id,
                total: selectedFare!.total,
              });
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
        onConfirmAddress={() => placeOrderHandler()}
        order={order}
        onEditAddress={() => {
          navigation.navigate('OrderDestination', {
            returnScreen: 'FoodOrderCheckout',
            returnParam: 'destination',
            value: order.destination,
          });
          setDestinationModalVisible(false);
        }}
        complement={complement}
        onChangeComplement={(text) => setComplement(text)}
        checked={!addressComplement}
        toggleAddressComplement={() => setAddressComplement(!addressComplement)}
        disabled={isLoading || (addressComplement && complement.length === 0)}
      />
    </KeyboardAwareScrollView>
  );
};
