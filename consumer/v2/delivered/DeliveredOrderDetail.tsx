import { Flavor, ReviewType } from '@appjusto/types';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import RoundedText from '../../../common/components/texts/RoundedText';
import SingleHeader from '../../../common/components/texts/SingleHeader';
import HR from '../../../common/components/views/HR';
import OrderMap from '../../../common/screens/orders/OrderMap';
import PlaceSummary from '../../../common/screens/orders/summary/PlaceSummary';
import { useCourierReview } from '../../../common/store/api/courier/hooks/useCourierReview';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
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
  const [reviewType, setReviewType] = React.useState<ReviewType>();
  const [comment, setComment] = React.useState('');
  const review = useCourierReview(orderId, order?.courier?.id);
  const [reviewLoading, setReviewLoading] = React.useState(false);
  const [reviewSent, setReviewSent] = React.useState(false);
  const [tipLoading, setTipLoading] = React.useState(false);
  const showChatButton = true;

  // helpers
  const openChat = React.useCallback(
    (counterpartId: string, counterpartFlavor: Flavor) => {
      navigation.navigate('OngoingOrderChat', {
        orderId,
        counterpartId,
        counterpartFlavor,
      }); // make this screen accessible here
    },
    [navigation, orderId]
  );
  const openChatWithRestaurant = React.useCallback(
    () => openChat(order?.business?.id!, 'business'),
    [openChat, order?.business?.id]
  );

  // handlers
  const tipHandler = async () => {
    if (!order) return;
    setTipLoading(true);
    try {
      if (tip > 0) await api.order().tipCourier(order.id, tip);
      dispatch(showToast(t('Caixinha enviada!')));
    } catch (error) {
      dispatch(showToast(t('Não foi possível enviar a caixinha'), 'error'));
    }
    setTipLoading(false);
  };

  const reviewHandler = async () => {
    if (!order) return;
    setReviewLoading(true);
    try {
      if (reviewType) {
        await api.courier().addReview(order.courier!.id, {
          type: reviewType,
          orderId,
          comment,
        });
        setReviewSent(true);
      }
    } catch (error) {
      dispatch(showToast(t('Não foi possível enviar a avaliação'), 'error'));
    }
    setReviewLoading(false);
  };

  // const placeOrderHandler = () => {
  //   if (order.type === 'p2p') {
  //     navigation.navigate('CreateOrderP2P', { orderId });
  //   }
  // };
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
      <OrderMap order={order} ratio={360 / 160} />
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
      {/* <HR height={padding} /> */}
      {order.type === 'food' && (
        <View>
          <DeliveredItems order={order} />
          {/* <HR height={padding} /> */}
        </View>
      )}
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
          {order.courier ? (
            <View>
              <ReviewBox
                review={review?.type ?? reviewType}
                comment={review?.comment ?? comment}
                editable={!review}
                focusable={!!review}
                onReviewChange={(type) => setReviewType(type)}
                onCommentChange={(value) => setComment(value)}
              />
              <DefaultButton
                title={
                  review?.type || reviewSent ? t('Avaliação enviada') : t('Avaliar entregador/a')
                }
                onPress={reviewHandler}
                style={{ margin: padding, marginTop: 0 }}
                activityIndicator={reviewLoading}
                disabled={reviewLoading || !!review?.type || reviewSent}
              />
              <HR height={padding} />
              <View>
                <TipControl
                  order={order}
                  tip={tip}
                  onChange={(value) => setTip(value)}
                  onConfirm={tipHandler}
                  isLoading={tipLoading}
                />
              </View>
              <HR height={padding} />
            </View>
          ) : null}
          <PaddedView>
            {showChatButton ? (
              <DefaultButton
                title={t('Abrir chat com restaurante')}
                onPress={() => openChatWithRestaurant()}
                style={{ marginBottom: padding }}
              />
            ) : null}

            <DefaultButton
              title={t('Relatar problema')}
              onPress={() =>
                navigation.navigate('ReportIssue', {
                  orderId: order.id,
                  issueType: 'consumer-delivery-problem',
                })
              }
              secondary
            />
          </PaddedView>
        </View>
      ) : // <PaddedView>
      //   <DefaultButton title={t('Refazer pedido')} onPress={placeOrderHandler} />
      // </PaddedView>
      null}
    </KeyboardAwareScrollView>
  );
};
