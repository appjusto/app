import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { ApiContext } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { IconConeYellow } from '../../../common/icons/icon-cone-yellow';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { useSegmentScreen } from '../../../common/store/api/track';
import { showToast } from '../../../common/store/ui/actions';
import { colors, padding, screens } from '../../../common/styles';
import { t } from '../../../strings';
import { OngoingOrderNavigatorParamList } from '../ongoing/types';
import { LoggedNavigatorParamList } from '../types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingOrderNavigatorParamList, 'OngoingOrderDeclined'>,
  StackNavigationProp<LoggedNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<OngoingOrderNavigatorParamList, 'OngoingOrderDeclined'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const OngoingOrderDeclined = ({ navigation, route }: Props) => {
  // params
  const { orderId, paymentMethodId } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch();
  // screen state
  const order = useObserveOrder(orderId);
  const [isLoading, setLoading] = React.useState(false);
  // effects
  const dispatchingStatus = order?.dispatchingStatus;
  React.useEffect(() => {
    if (paymentMethodId) {
      navigation.setParams({
        paymentMethodId: undefined,
      });
      // when the items' charge is ok but the courier's charge is declined
      (async () => {
        setLoading(true);
        try {
          await api
            .order()
            .updateOrderCallable(orderId, { payableWith: 'credit_card', paymentMethodId });
        } catch (error) {
          setLoading(false);
          dispatch(
            showToast(t('Não foi possível alterar a forma de pagamento. Tente novamente.'), 'error')
          );
        }
      })();
    }
  }, [paymentMethodId, orderId, navigation, api, dispatch]);
  // navigating to OngoingOrder after the user changes his payment method
  // and the matching is restarted
  React.useEffect(() => {
    if (dispatchingStatus === 'matching') navigation.navigate('OngoingOrder', { orderId });
  }, [dispatchingStatus, orderId, navigation]);
  // status === 'declined' and the user does not add a new card
  // after 1 hour, the status turns into 'canceled'
  React.useEffect(() => {
    if (!order) return;
    if (order.status === 'canceled') navigation.navigate('OrderCanceled', { orderId });
  }, [navigation, order, orderId]);
  // tracking
  useSegmentScreen('OngoingOrderDeclined');
  // UI
  if (!order || isLoading) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  // handlers
  const reviewOrderHandler = () => {
    if (!order) return;
    if (order.type === 'p2p') {
      navigation.replace('P2POrderNavigator', {
        screen: 'CreateOrderP2P',
        params: {
          orderId: order.id,
        },
      });
    } else {
      navigation.replace('FoodOrderNavigator', {
        screen: 'RestaurantNavigator',
        params: {
          restaurantId: order.business!.id,
          orderId: order.id,
          screen: 'FoodOrderCheckout',
        },
      });
    }
  };
  const changePaymentHandler = () => {
    if (dispatchingStatus === 'declined') {
      navigation.navigate('ProfilePaymentMethods', {
        returnScreen: 'OngoingOrderDeclined',
        courierFee: order.fare!.courier.value,
        fleetName: order.fare!.fleet.name,
      });
    } else navigation.navigate('ProfilePaymentMethods', { returnScreen: 'OngoingOrderDeclined' });
  };
  const header = (() => {
    if (dispatchingStatus === 'declined')
      return `${t('Problemas no pagamento do entregador')}${order.issue ?? ''}`;
    if (order.status === 'canceled') return t('Esse pedido foi cancelado');
    else return `${t('Problemas no pagamento\n')}${order.issue ?? ''}`;
  })();
  const description = (() => {
    if (dispatchingStatus === 'declined')
      return t(
        'O pedido está pronto, porém não conseguimos efetuar a cobrança destinada à entrega. Altere a forma de pagamento para continuar.'
      );
    else
      return t(
        'Não conseguimos efetuar a cobrança. Por favor, altere a forma de pagamento e tente novamente.'
      );
  })();
  console.log(order.issue);
  // UI
  return (
    <ScrollView
      style={{ ...screens.default }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <FeedbackView
        header={header}
        description={description}
        icon={<IconConeYellow />}
        background={colors.white}
      >
        {order.dispatchingStatus === 'declined' ? (
          <View>
            <DefaultButton title={t('Alterar forma de pagamento')} onPress={changePaymentHandler} />
          </View>
        ) : null}
        {order.status === 'declined' ? (
          <View style={{ paddingVertical: padding }}>
            <DefaultButton
              title={t('Revisar pedido')}
              secondary
              onPress={() => reviewOrderHandler()}
            />
          </View>
        ) : null}
        {order.status === 'canceled' ? (
          <View style={{ paddingVertical: padding }}>
            <DefaultButton
              title={t('Voltar para o início')}
              secondary
              onPress={() => {
                navigation.replace('MainNavigator', { screen: 'Home' });
              }}
            />
          </View>
        ) : null}
      </FeedbackView>
    </ScrollView>
  );
};
