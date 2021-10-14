import { Fare, Place } from '@appjusto/types';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { isEmpty } from 'lodash';
import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { getConsumer } from '../../../common/store/consumer/selectors';
import { isConsumerProfileComplete } from '../../../common/store/courier/validators';
import { showToast } from '../../../common/store/ui/actions';
import { screens } from '../../../common/styles';
import { t } from '../../../strings';
import { LoggedNavigatorParamList } from '../types';
import { P2POrderHeader } from './P2POrderHeader';
import P2POrderPager from './P2POrderPager';
import { P2POrderNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<P2POrderNavigatorParamList, 'CreateOrderP2P'>,
  StackNavigationProp<LoggedNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<P2POrderNavigatorParamList, 'CreateOrderP2P'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // params
  const { params } = route;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // redux store
  const consumer = useSelector(getConsumer);
  // state
  const [orderId, setOrderId] = React.useState<string>();
  const order = useObserveOrder(orderId)!;
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = React.useState(
    consumer?.paymentChannel?.mostRecentPaymentMethodId
  );
  const [isLoading, setLoading] = React.useState(false);
  const [cpf, setCpf] = React.useState(consumer?.cpf ?? '');
  const [wantsCpf, setWantsCpf] = React.useState(false);
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
    console.log('CreateOrderP2P useEffect; params: ', params);
    if (params?.orderId) {
      setOrderId(params.orderId);
      navigation.setParams({
        orderId: undefined,
      });
    }
    if (params?.origin) {
      if (!order) {
        (async () => {
          try {
            setLoading(true);
            const newOrder = await api.order().createOrderP2P(consumer!, params.origin!);
            setLoading(false);
            setOrderId(newOrder.id);
          } catch (error) {
            console.log(error);
            Sentry.Native.captureException(error);
            dispatch(showToast(error.toString(), 'error'));
          }
        })();
      } else if (orderId) {
        api.order().updateOrder(orderId, { origin: params.origin });
      }
      navigation.setParams({
        origin: undefined,
      });
    }
    if (order && orderId && params?.destination) {
      api.order().updateOrder(orderId, { destination: params.destination });
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
  }, [api, consumer, dispatch, navigation, order, orderId, params]);
  // if the order status becomes 'expired'
  React.useEffect(() => {
    if (!order) return;
    if (order.status === 'expired') navigation.navigate('MainNavigator', { screen: 'Home' });
  }, [order, navigation]);
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
  // navigate to 'AddressComplete' to enter address
  const navigateToAddressComplete = React.useCallback(
    (returnParam: string, value?: Place) => {
      navigation.navigate('AddressComplete', {
        returnScreen: 'CreateOrderP2P',
        returnParam,
        value,
      });
    },
    [navigation]
  );
  // navigate to ProfileAddCard or ProfilePaymentMethods to add or select payment method
  const navigateToFillPaymentInfo = React.useCallback(() => {
    // if user has no payment method, go direct to 'AddCard' screen
    if (!isConsumerProfileComplete(consumer)) {
      const returnScreen = !selectedPaymentMethodId ? 'ProfileAddCard' : 'CreateOrderP2P';
      navigation.navigate('ProfileEdit', { returnScreen, returnNextScreen: 'CreateOrderP2P' });
    } else if (!selectedPaymentMethodId) {
      navigation.navigate('ProfileAddCard', { returnScreen: 'CreateOrderP2P' });
    } else {
      navigation.navigate('ProfilePaymentMethods', { returnScreen: 'CreateOrderP2P' });
    }
  }, [consumer, navigation, selectedPaymentMethodId]);
  // confirm order
  const placeOrderHandler = async (fleetId: string) => {
    if (!orderId) return;
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
        orderId,
        fleetId,
        {
          payableWith: 'credit_card',
          paymentMethodId: selectedPaymentMethodId,
        },
        wantsCpf
      );

      setLoading(false);
      navigation.replace('OngoingOrderNavigator', {
        screen: 'OngoingOrderConfirming',
        params: { orderId },
      });
    } catch (error) {
      console.warn(error.toString());
      dispatch(showToast(error.toString(), 'error'));
    }
  };

  // UI
  return (
    <View style={{ ...screens.default }}>
      <P2POrderHeader order={order} />
      <P2POrderPager
        order={order}
        isLoading={isLoading}
        selectedPaymentMethodId={selectedPaymentMethodId}
        navigateToAddressComplete={navigateToAddressComplete}
        navigateToFillPaymentInfo={navigateToFillPaymentInfo}
        navigateFleetDetail={(fleetId: string) => {
          navigation.navigate('FleetDetail', { fleetId });
        }}
        navigateToTransportableItems={() => {
          navigation.navigate('TransportableItems');
        }}
        onSubmit={() => placeOrderHandler(selectedFare?.fleet?.id!)}
        navigateToPixPayment={(total, fleetId) =>
          navigation.navigate('PayWithPix', { orderId: orderId!, total, fleetId })
        }
        navigateToAboutCharges={() => navigation.navigate('AboutCharges')}
        wantsCpf={wantsCpf}
        onSwitchValueChange={() => setWantsCpf(!wantsCpf)}
        cpf={cpf}
        setCpf={(text) => setCpf(text)}
        canSubmit={canSubmit}
        quotes={quotes}
        selectedFare={selectedFare}
        onFareSelect={(fare) => setSelectedFare(fare)}
        onRetry={getOrderQuotesHandler}
        total={selectedFare?.total ?? 0}
      />
    </View>
  );
}
