import { Flavor } from '@appjusto/types';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import { HorizontalSelectItem } from '../../../common/components/buttons/HorizontalSelect';
import PaddedView from '../../../common/components/containers/PaddedView';
import HR from '../../../common/components/views/HR';
import useNotificationToken from '../../../common/hooks/useNotificationToken';
import { StatusAndMessages } from '../../../common/screens/orders/ongoing/StatusAndMessages';
import OrderMap from '../../../common/screens/orders/OrderMap';
import { OrderAdditionalInfo } from '../../../common/screens/orders/summary/OrderAdditionaInfo';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { useObserveOrderConfirmation } from '../../../common/store/api/order/hooks/useObserveOrderConfirmation';
import { useSegmentScreen } from '../../../common/store/api/track';
import { borders, colors, padding, screens } from '../../../common/styles';
import { t } from '../../../strings';
import { OrderCostBreakdown } from '../common/breakdown/OrderCostBreakdown';
import { DeliveredItems } from '../common/DeliveredItems';
import { OrderPlacesSummary } from '../common/order-summary/OrderPlacesSummary';
import { LoggedNavigatorParamList } from '../types';
import { DeliveryActions } from './DeliveryActions';
import { DeliveryConfirmation } from './DeliveryConfirmation';
import { DeliveryInfo } from './DeliveryInfo';
import { FoodOrderItemsInfo } from './FoodOrderItemsInfo';
import { OngoingMapAndInfo } from './OngoingMapAndInfo';
import { OngoingOrderStatus } from './OngoingOrderStatus';
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
  const confirmation = useObserveOrderConfirmation(orderId);
  const courierId = order?.courier?.id;
  const businessId = order?.business?.id;
  useNotificationToken();
  const codeFeedbackData: HorizontalSelectItem[] = [
    { title: t('Encontrar com o entregador'), id: '1' },
    { title: t('Deixar na portaria'), id: '2' },
  ];
  const [codeFeedback, setCodeFeedback] = React.useState<HorizontalSelectItem>(codeFeedbackData[0]);
  const [wantsCode, setWantsCode] = React.useState(true);
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
    (delayed?: boolean) => openChat(courierId!, 'courier', delayed),
    [openChat, courierId]
  );
  const openChatWithRestaurant = React.useCallback(
    (delayed?: boolean) => openChat(businessId!, 'business', delayed),
    [openChat, businessId]
  );
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
      navigation.navigate('OngoingOrderFeedback', { orderId });
    }
    // whenever a consumer payment method has been approved for the itens
    // but has no funds to pay for the courier in a food order
    else if (order.status === 'declined') {
      navigation.replace('OngoingOrderDeclined', { orderId });
    }
    // we will need to navigate to OrderCanceled when the order is cancelled by
    // a restaurant or courier
    // else if (order.status === 'canceled') {
    //   navigation.replace('OrderCanceled', { orderId });
    // }
    else if (order.dispatchingStatus === 'no-match') {
      navigation.navigate('OngoingOrderNoMatch', { orderId });
    }
  }, [navigation, order, orderId]);
  console.log(orderId);
  const [newScreen, setNewScreen] = React.useState(true);
  // UI
  // showing the indicator until the order is loaded
  if (!order) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  // UI handlers
  const navigateToReportIssue = () =>
    navigation.navigate('ReportIssue', {
      orderId: order.id,
      issueType: 'consumer-delivery-problem',
    });
  const navigateToConfirmCancel = () => {
    navigation.navigate('OngoingOrderConfirmCancel', { orderId });
  };
  const navigateToCourierDetail = () =>
    navigation.navigate('OngoingOrderCourierDetail', { orderId });
  const navigateToChangeRoute = () =>
    navigation.navigate('P2POrderNavigator', {
      screen: 'CreateOrderP2P',
      params: {
        orderId,
      },
    });
  // ongoing UI
  return (
    <ScrollView
      style={{ ...screens.default, paddingBottom: 32 }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      {newScreen ? (
        <View style={{ flex: 1 }}>
          {/* top */}
          <OngoingOrderStatus order={order} />
          <OngoingMapAndInfo
            order={order}
            onCourierDetail={navigateToCourierDetail}
            onChatWithCourier={openChatWithCourier}
          />
          <DeliveryConfirmation
            data={codeFeedbackData}
            selected={codeFeedback}
            onSelect={setCodeFeedback}
            switchValue={wantsCode}
            onChangeCodeDelivery={() => setWantsCode(!wantsCode)}
          />
          <FoodOrderItemsInfo order={order} />
        </View>
      ) : (
        <View>
          {order.type === 'p2p' ? (
            <View style={{ flex: 1, ...borders.default, borderColor: 'white' }}>
              <OngoingOrderStatus order={order} />
              {order.status !== 'dispatching' ? (
                <View style={{ flex: 1 }}>
                  <OrderPlacesSummary order={order} onEditStep={() => null} />
                  <View style={{ flex: 1 }} />
                  <PaddedView
                    style={{
                      marginTop: padding,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <View>
                      <DefaultButton
                        title={t('Relatar problema')}
                        secondary
                        onPress={navigateToReportIssue}
                      />
                    </View>
                    <View>
                      <DefaultButton
                        title={t('Cancelar pedido')}
                        secondary
                        onPress={navigateToConfirmCancel}
                      />
                    </View>
                  </PaddedView>
                  <View style={{ flex: 1 }} />
                </View>
              ) : (
                <View style={{ flex: 1 }}>
                  <OrderMap order={order} ratio={1} />
                  <StatusAndMessages
                    order={order}
                    confirmation={confirmation}
                    onPress={(from) => openChat(from.id, from.agent)}
                  />
                  <DeliveryInfo order={order} onCourierDetail={navigateToCourierDetail} />
                  <DefaultButton
                    title={t('Abrir chat com o entregador')}
                    onPress={() => openChatWithCourier()}
                    style={{ marginHorizontal: padding, marginBottom: padding }}
                  />

                  <HR height={padding} />
                  <View style={{ marginBottom: padding }}>
                    <DeliveryActions
                      order={order}
                      onChangeRoute={() =>
                        navigation.navigate('P2POrderNavigator', {
                          screen: 'CreateOrderP2P',
                          params: {
                            orderId,
                          },
                        })
                      }
                      navigateToReportIssue={navigateToReportIssue}
                      navigateToConfirmCancel={navigateToConfirmCancel}
                    />
                  </View>
                </View>
              )}
            </View>
          ) : (
            <View style={{ flex: 1, ...borders.default, borderColor: 'white' }}>
              <OngoingOrderStatus order={order} />
              {order.status !== 'dispatching' ? (
                <View style={{ flex: 1 }}>
                  <HR height={padding} />
                  <DeliveredItems order={order} />
                  {order.additionalInfo ? (
                    <View>
                      <OrderAdditionalInfo
                        value={order.additionalInfo}
                        onAddInfo={() => null}
                        editable={false}
                      />
                    </View>
                  ) : null}
                  <HR height={padding} />
                  <View style={{ paddingTop: padding }}>
                    <OrderCostBreakdown order={order} selectedFare={order.fare} />
                  </View>
                  <HR height={padding} />
                  <DeliveryActions
                    order={order}
                    onChangeRoute={navigateToChangeRoute}
                    navigateToReportIssue={navigateToReportIssue}
                    navigateToConfirmCancel={navigateToConfirmCancel}
                  />
                  <View style={{ flex: 1 }} />
                  <PaddedView>
                    <DefaultButton
                      title={t('Abrir chat com o restaurante')}
                      onPress={() => openChatWithRestaurant()}
                    />
                  </PaddedView>
                </View>
              ) : (
                <View style={{ flex: 1 }}>
                  <OrderMap order={order} ratio={1} />
                  <StatusAndMessages
                    order={order}
                    confirmation={confirmation}
                    onPress={(from) => openChat(from.id, from.agent)}
                  />
                  <DeliveryInfo order={order} onCourierDetail={navigateToCourierDetail} />
                  {/* pode estar causando o problema de clicar no topo - chat em 'food' */}
                  <DefaultButton
                    title={t('Abrir chat com o entregador')}
                    onPress={() => openChatWithCourier()}
                    style={{ marginHorizontal: padding, marginBottom: padding }}
                  />
                  <HR />
                  <HR height={padding} />
                  <DeliveredItems order={order} />
                  <HR height={padding} />
                  <DeliveryActions
                    order={order}
                    onChangeRoute={navigateToChangeRoute}
                    navigateToReportIssue={navigateToReportIssue}
                    navigateToConfirmCancel={navigateToConfirmCancel}
                  />
                  <View style={{ marginHorizontal: padding, marginBottom: padding }}>
                    <DefaultButton
                      title={t('Abrir chat com o restaurante')}
                      onPress={() => openChatWithRestaurant()}
                      style={{ marginBottom: padding }}
                      secondary
                    />
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}
