import { ChatMessageUser, Flavor } from '@appjusto/types';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import HR from '../../../common/components/views/HR';
import { useNotificationToken } from '../../../common/hooks/useNotificationToken';
import { useObserveOrderCourierLocation } from '../../../common/store/api/order/courier/useObserveOrderCourierLocation';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { useObserveOrderConfirmation } from '../../../common/store/api/order/hooks/useObserveOrderConfirmation';
import { track, useSegmentScreen } from '../../../common/store/api/track';
import { colors, halfPadding, padding, screens } from '../../../common/styles';
import { t } from '../../../strings';
import { OrderCostBreakdown } from '../common/breakdown/OrderCostBreakdown';
import { LoggedNavigatorParamList } from '../types';
import { DeliveryConfirmation } from './DeliveryConfirmation';
import { FoodOrderItemsInfo } from './FoodOrderItemsInfo';
import { OngoingActions } from './OngoingActions';
import { OngoingMapAndInfo } from './OngoingMapAndInfo';
import { OngoingOrderStatus } from './OngoingOrderStatus';
import { OrderNumber } from './OrderNumber';
import { OngoingOrderNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingOrderNavigatorParamList, 'OngoingOrder'>,
  StackNavigationProp<LoggedNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<OngoingOrderNavigatorParamList, 'OngoingOrder'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // params
  const { orderId } = route.params;
  // screen state
  const order = useObserveOrder(orderId);
  const courierLocation = useObserveOrderCourierLocation(orderId, order?.courier?.id);
  const confirmation = useObserveOrderConfirmation(orderId);
  const courierId = order?.courier?.id;
  const businessId = order?.business?.id;
  useNotificationToken();
  const [wantsCode, setWantsCode] = React.useState(false);
  // tracking
  useSegmentScreen('Ongoing Delivery');
  // helpers
  const openChat = React.useCallback(
    (counterpartId: string, counterpartFlavor: Flavor, delayed?: boolean) => {
      setTimeout(
        () => {
          navigation.navigate('OngoingOrderChat', {
            orderId,
            counterpartId,
            counterpartFlavor,
          });
        },
        delayed ? 100 : 0
      );
    },
    [navigation, orderId]
  );
  const openChatWithCourier = React.useCallback(
    (delayed?: boolean) => {
      track('consumer chat with courier');
      openChat(courierId!, 'courier', delayed);
    },
    [openChat, courierId]
  );
  const openChatWithRestaurant = React.useCallback(
    (delayed?: boolean) => {
      track('consumer chat with business');
      openChat(businessId!, 'business', delayed);
    },
    [openChat, businessId]
  );
  const openChatHandler = (from: ChatMessageUser) => {
    track('consumer clicked to open chat');
    openChat(from.id, from.agent);
  };
  // side effects
  // whenever params changes
  // open chat if there's a new message
  React.useEffect(() => {
    if (route.params.chatFrom) {
      navigation.setParams({ chatFrom: undefined });
      openChat(route.params.chatFrom.id, route.params.chatFrom.agent, true);
    }
  }, [route.params, navigation, openChat]);
  // whenever order changes
  // check status to navigate to other screens
  React.useEffect(() => {
    if (!order) return;
    if (order.status === 'delivered') {
      navigation.replace('OngoingOrderFeedback', { orderId });
    }
    // whenever a consumer payment method has been approved for the itens
    // but has no funds to pay for the courier in a food order
    else if (order.status === 'declined') {
      navigation.replace('OngoingOrderDeclined', { orderId });
    }
    // when a restaurant cancels an order
    else if (order.status === 'canceled') {
      if (order.type === 'food') {
        navigation.replace('OrderCanceled', { orderId });
      }
    } else if (order.dispatchingStatus === 'no-match') {
      navigation.navigate('OngoingOrderNoMatch', { orderId });
    } else if (order.dispatchingStatus === 'declined') {
      navigation.replace('OngoingOrderDeclined', { orderId });
    }
  }, [navigation, order, orderId]);
  // header title
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: order?.code
        ? `${t('Pedido')} #${order.code} ${t('em andamento')}`
        : t('Pedido em andamento'),
    });
  }, [navigation, order?.code]);
  // UI
  // showing the indicator until the order is loaded
  if (!order || !businessId) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  // UI handlers

  const navigateToOrderProblem = () => {
    navigation.navigate('OngoingOrderProblem', {
      orderId: order.id,
    });
  };
  const navigateToConfirmCancel = () => {
    navigation.navigate('OngoingOrderConfirmCancel', { orderId });
  };
  const navigateToCourierDetail = () => {
    navigation.navigate('OngoingOrderCourierDetail', { orderId });
  };
  // ongoing UI
  return (
    <KeyboardAwareScrollView
      style={{ ...screens.default, paddingBottom: 32 }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
      enableOnAndroid
      enableAutomaticScroll
      keyboardOpeningTime={0}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ flex: 1 }}>
        {/* top */}
        <OngoingOrderStatus order={order} />
        {order.fulfillment === 'delivery' && order.status !== 'dispatching' ? (
          <HR height={padding} />
        ) : null}
        <OngoingMapAndInfo
          order={order}
          courierLocation={courierLocation}
          onCourierDetail={navigateToCourierDetail}
          onChatWithCourier={openChatWithCourier}
          onOpenChat={openChatHandler}
        />
        {order.dispatchingStatus !== 'outsourced' &&
        order.status !== 'scheduled' &&
        order.fulfillment === 'delivery' ? (
          <DeliveryConfirmation
            switchValue={wantsCode}
            onChangeCodeDelivery={() => {
              track('changed code delivery preferences');
              setWantsCode(!wantsCode);
            }}
            confirmation={confirmation}
          />
        ) : null}
        {order.fulfillment === 'take-away' ? (
          <OrderNumber code={order.code} businessId={businessId} />
        ) : null}
        <FoodOrderItemsInfo order={order} />
        {order.dispatchingStatus !== 'outsourced' ? <HR height={padding} /> : null}
        <View style={{ paddingTop: halfPadding }}>
          <OrderCostBreakdown order={order} selectedFare={order.fare} />
        </View>
        <HR height={padding} />
        <View style={{ paddingBottom: 24 }}>
          <OngoingActions
            order={order}
            navigateToReportIssue={navigateToOrderProblem}
            navigateToConfirmCancel={navigateToConfirmCancel}
            onMessageReceived={openChatHandler}
          />
          {order.type === 'food' ? (
            <View>
              <HR />
              <PaddedView>
                <DefaultButton
                  title={t('Abrir chat com o restaurante')}
                  onPress={() => openChatWithRestaurant()}
                />
              </PaddedView>
            </View>
          ) : null}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
