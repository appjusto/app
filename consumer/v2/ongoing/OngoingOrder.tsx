import { Flavor } from '@appjusto/types';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import HR from '../../../common/components/views/HR';
import useNotificationToken from '../../../common/hooks/useNotificationToken';
import { StatusAndMessages } from '../../../common/screens/orders/ongoing/StatusAndMessages';
import OrderMap from '../../../common/screens/orders/OrderMap';
import { OrderAdditionalInfo } from '../../../common/screens/orders/summary/OrderAdditionaInfo';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { getConsumer } from '../../../common/store/consumer/selectors';
import { updateProfile } from '../../../common/store/user/actions';
import { colors, padding, screens } from '../../../common/styles';
import { t } from '../../../strings';
import { DeliveredItems } from '../common/DeliveredItems';
import { OrderPlacesSummary } from '../common/order-summary/OrderPlacesSummary';
import { LoggedNavigatorParamList } from '../types';
import { DeliveryActions } from './DeliveryActions';
import { DeliveryInfo } from './DeliveryInfo';
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
  const { orderId, chatFrom } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // redux
  const consumer = useSelector(getConsumer)!;
  // screen state
  const order = useObserveOrder(orderId);
  const courierId = order?.courier?.id;
  const businessId = order?.business?.id;
  const [notificationToken, shouldDeleteToken, shouldUpdateToken] = useNotificationToken(
    consumer!.notificationToken
  );
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
    if (chatFrom) {
      navigation.setParams({ chatFrom: undefined });
      openChat(chatFrom.id, chatFrom.agent);
    }
  }, [navigation, chatFrom, openChat]);
  // whenever notification token needs to be updated
  React.useEffect(() => {
    if (shouldDeleteToken || shouldUpdateToken) {
      const token = shouldUpdateToken ? notificationToken : null;
      dispatch(updateProfile(api)(consumer.id, { notificationToken: token }));
    }
  }, [api, consumer.id, dispatch, notificationToken, shouldDeleteToken, shouldUpdateToken]);
  // whenever order changes
  // check status to navigate to other screens
  React.useEffect(() => {
    if (!order) return;
    if (order.status === 'delivered') {
      navigation.navigate('OngoingOrderFeedback', { orderId });
    } else if (order.status === 'canceled') {
      navigation.replace('OrderCanceled', { orderId });
    } else if (order.dispatchingStatus === 'no-match') {
      navigation.navigate('OngoingOrderNoMatch', { orderId });
    }
  }, [navigation, order, orderId]);
  console.log(orderId);
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
  const navigateToConfirmCancel = () =>
    navigation.navigate('OngoingOrderConfirmCancel', { orderId });
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
      scrollIndicatorInsets={{ right: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <OngoingOrderStatus order={order} />
      {order.type === 'p2p' ? (
        <View style={{ flex: 1 }}>
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
                onMessageReceived={openChatWithCourier} // just with the courier for now
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
        <View style={{ flex: 1 }}>
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
              <OrderMap order={order} ratio={1.2} />
              <StatusAndMessages order={order} onMessageReceived={() => openChatWithCourier()} />
              <DeliveryInfo order={order} onCourierDetail={navigateToCourierDetail} />
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
    </ScrollView>
  );
}
