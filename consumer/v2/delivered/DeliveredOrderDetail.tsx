import { Flavor } from '@appjusto/types';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Keyboard, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import RoundedText from '../../../common/components/texts/RoundedText';
import SingleHeader from '../../../common/components/texts/SingleHeader';
import HR from '../../../common/components/views/HR';
import { useChatisEnabled } from '../../../common/hooks/useChatIsEnabled';
import OrderMap from '../../../common/screens/orders/OrderMap';
import PlaceSummary from '../../../common/screens/orders/summary/PlaceSummary';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { track, useSegmentScreen } from '../../../common/store/api/track';
import { showToast } from '../../../common/store/ui/actions';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import {
  formatCurrency,
  formatDistance,
  formatDuration,
  separateWithDot,
} from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { OrderCostBreakdown } from '../common/breakdown/OrderCostBreakdown';
import { DeliveredItems } from '../common/DeliveredItems';
import { ReviewBox } from '../common/review/ReviewBox';
import TipControl from '../common/TipControl';
import { DeliveredOrderNavigatorParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<
  DeliveredOrderNavigatorParamList,
  'DeliveredOrderDetail'
>;
type ScreenRoute = RouteProp<DeliveredOrderNavigatorParamList, 'DeliveredOrderDetail'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export const DeliveredOrderDetail = ({ navigation, route }: Props) => {
  // context
  const { orderId } = route.params;
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // screen state
  const order = useObserveOrder(orderId);
  const [tip, setTip] = React.useState(0);
  const [tipLoading, setTipLoading] = React.useState(false);
  const [tipSent, setTipSent] = React.useState(false);
  const showChatButton = useChatisEnabled(order);
  // tracking
  useSegmentScreen('DeliveredOrderDetail');

  // helpers
  const openChat = React.useCallback(
    (counterpartId: string, counterpartFlavor: Flavor) => {
      navigation.navigate('DeliveredOrderChat', {
        orderId,
        counterpartId,
        counterpartFlavor,
      });
    },
    [navigation, orderId]
  );
  const openChatWithRestaurant = React.useCallback(() => {
    track('opening chat with restaurant');
    openChat(order?.business?.id!, 'business');
  }, [openChat, order?.business?.id]);
  const openChatWithCourier = React.useCallback(() => {
    track('consumer chat with courier');
    openChat(order?.courier?.id!, 'courier');
  }, [openChat, order?.courier?.id]);

  // handlers
  const openChatHandler = () => {
    if (!order) return;
    if (order.type === 'food') {
      openChatWithRestaurant();
    } else if (order.type === 'p2p') {
      openChatWithCourier();
    }
  };
  const tipHandler = async () => {
    if (!order) return;
    Keyboard.dismiss();
    try {
      setTipLoading(true);
      if (tip > 0) await api.order().tipCourier(order.id, tip);
      track('consumer sent tip to courier');
      dispatch(showToast(t('Caixinha enviada!')));
      setTipSent(true);
      setTipLoading(false);
    } catch (error) {
      dispatch(showToast(t('Não foi possível enviar a caixinha'), 'error'));
      setTipLoading(false);
    }
  };
  const finishHandler = () => navigation.goBack();
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
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={{ flex: 1 }}>
        <OrderMap
          originLocation={order.origin?.location}
          destinationLocation={order.destination?.location}
          route={order.route}
          ratio={360 / 160}
        />
        {order.status === 'canceled' ? (
          <View>
            <SingleHeader title={t('Pedido cancelado')} />
            <HR height={padding} />
          </View>
        ) : null}
        <PaddedView>
          <PlaceSummary title={t('Retirada')} place={order.origin!} />
          <PlaceSummary title={t('Entrega')} place={order.destination!} />
          <View style={{ marginTop: halfPadding }}>
            <RoundedText>
              {separateWithDot(
                formatDistance(order.route?.distance ?? 0),
                formatDuration(order.route?.duration ?? 0)
              )}
            </RoundedText>
          </View>
        </PaddedView>
        {order.type === 'food' ? (
          <View>
            <DeliveredItems order={order} />
          </View>
        ) : null}
        {order.status !== 'canceled' ? (
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingRight: padding,
                paddingBottom: halfPadding,
              }}
            >
              <SingleHeader title={t('Total pago')} />
              <Text style={{ ...texts.xl }}>
                {formatCurrency((order.fare?.total ?? 0) + (order.tip?.value ?? 0))}
              </Text>
            </View>
            <HR height={padding} />
            <View style={{ paddingTop: halfPadding }}>
              <OrderCostBreakdown order={order} selectedFare={order.fare} />
            </View>
            <HR height={padding} />
            {order.courier?.id ? (
              <View>
                <View>
                  <TipControl
                    order={order}
                    tip={tip}
                    onChange={(value) => setTip(value)}
                    onConfirm={tipHandler}
                    isLoading={tipLoading}
                    tipSent={tipSent}
                  />
                  <HR height={padding} />
                </View>
                <ReviewBox
                  order={order}
                  screen="DeliveredOrderDetail"
                  onCompleteReview={finishHandler}
                >
                  {showChatButton ? (
                    <DefaultButton
                      title={
                        order.type === 'food'
                          ? t('Abrir chat com restaurante')
                          : t('Abrir chat com o entregador')
                      }
                      onPress={openChatHandler}
                      style={{ marginBottom: padding }}
                    />
                  ) : null}
                  <DefaultButton
                    title={t('Relatar problema')}
                    onPress={() => {
                      navigation.navigate('ReportIssue', {
                        orderId: order.id,
                        issueType: 'consumer-delivery-problem',
                      });
                    }}
                    secondary
                  />
                </ReviewBox>
              </View>
            ) : (
              <View>
                <ReviewBox
                  order={order}
                  screen="DeliveredOrderDetail"
                  onCompleteReview={finishHandler}
                >
                  {showChatButton ? (
                    <DefaultButton
                      title={
                        order.type === 'food'
                          ? t('Abrir chat com restaurante')
                          : t('Abrir chat com o entregador')
                      }
                      onPress={openChatHandler}
                      style={{ marginBottom: padding }}
                    />
                  ) : null}
                  <DefaultButton
                    title={t('Relatar problema')}
                    onPress={() => {
                      navigation.navigate('ReportIssue', {
                        orderId: order.id,
                        issueType: 'consumer-delivery-problem',
                      });
                    }}
                    secondary
                  />
                </ReviewBox>
              </View>
            )}
          </View>
        ) : (
          <PaddedView style={{ flex: 1 }}>
            {showChatButton ? (
              <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }} />
                <DefaultButton
                  title={t('Abrir chat com restaurante')}
                  onPress={() => openChatWithRestaurant()}
                  style={{ marginBottom: padding }}
                />
              </View>
            ) : null}
          </PaddedView>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
};
