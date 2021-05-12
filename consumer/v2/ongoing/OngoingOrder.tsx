import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Dimensions, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import HR from '../../../common/components/views/HR';
import useNotificationToken from '../../../common/hooks/useNotificationToken';
import { StatusAndMessages } from '../../../common/screens/orders/ongoing/StatusAndMessages';
import OrderMap from '../../../common/screens/orders/OrderMap';
import useObserveOrder from '../../../common/store/api/order/hooks/useObserveOrder';
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
  const { width } = Dimensions.get('window');
  // params
  const { orderId, newMessage } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // redux
  const consumer = useSelector(getConsumer)!;
  // screen state
  const [seenCodeInfo, setSeenCodeInfo] = React.useState(false);
  const { order } = useObserveOrder(orderId);
  const [notificationToken, shouldDeleteToken, shouldUpdateToken] = useNotificationToken(
    consumer!.notificationToken
  );
  // side effects
  // whenever params changes
  // open chat if there's a new message
  React.useEffect(() => {
    if (newMessage) {
      setTimeout(() => {
        navigation.setParams({ newMessage: false });
        navigation.navigate('OngoingOrderChat', { orderId });
      }, 100);
    }
  }, [navigation, newMessage, orderId]);
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
      navigation.navigate('OrderCanceled', { orderId });
    } else if (order.dispatchingStatus === 'no-match') {
      navigation.navigate('OngoingOrderNoMatch', { orderId });
    }
  }, [order]);

  // UI
  // showing the indicator until the order is loaded
  if (!order) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  // handlers
  const openChatHandler = () => navigation.navigate('OngoingOrderChat', { orderId });
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
  const { dispatchingState } = order;
  return (
    <ScrollView
      style={{ ...screens.default, paddingBottom: 32 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <OngoingOrderStatus order={order} />
      {order.type === 'p2p' && order.status === 'dispatching' ? (
        <View style={{ flex: 1 }}>
          <View>
            <OrderMap order={order} ratio={1} />
            {/* <StatusAndMessages
              dispatchingState={dispatchingState}
              orderId={orderId}
              onMessageReceived={openChatHandler}
            /> */}
          </View>
          <DeliveryInfo order={order} onCourierDetail={navigateToCourierDetail} />
          <DefaultButton
            title={t('Abrir chat com o entregador')}
            onPress={openChatHandler}
            style={{ marginHorizontal: padding, marginBottom: padding }}
          />

          <HR height={padding} />
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
      ) : (
        <View style={{ flex: 1 }}>
          {order.status === 'dispatching' ? (
            <View>
              <View>
                <OrderMap order={order} ratio={1.2} />
                <StatusAndMessages
                  dispatchingState={dispatchingState}
                  orderId={orderId}
                  onMessageReceived={openChatHandler}
                />
              </View>
              <DeliveryInfo order={order} onCourierDetail={navigateToCourierDetail} />
              <DefaultButton
                title={t('Abrir chat com o entregador')}
                onPress={openChatHandler}
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
            </View>
          ) : (
            <View>
              {order.type === 'food' && (
                <View>
                  <HR height={padding} />
                  <DeliveredItems order={order} />
                  <HR height={padding} />
                  <DeliveryActions
                    order={order}
                    onChangeRoute={navigateToChangeRoute}
                    navigateToReportIssue={navigateToReportIssue}
                    navigateToConfirmCancel={navigateToConfirmCancel}
                  />
                </View>
              )}
              {order.type === 'p2p' && (
                <View>
                  <OrderPlacesSummary order={order} onEditStep={() => null} />
                  <PaddedView
                    style={{
                      marginTop: padding,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <View style={{ width: '49%' }}>
                      <DefaultButton
                        title={t('Relatar um problema')}
                        secondary
                        onPress={navigateToReportIssue}
                      />
                    </View>
                    <View style={{ width: '49%' }}>
                      <DefaultButton
                        title={t('Cancelar pedido')}
                        secondary
                        onPress={navigateToConfirmCancel}
                      />
                    </View>
                  </PaddedView>
                </View>
              )}

              {order.type === 'food' && (
                <View>
                  <HR height={padding} />
                  <HR />
                  <PaddedView>
                    <DefaultButton title={t('Abrir chat com o restaurante')} onPress={() => null} />
                  </PaddedView>
                </View>
              )}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}
