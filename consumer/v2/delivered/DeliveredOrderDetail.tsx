import { ReviewType } from '@appjusto/types';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import RoundedText from '../../../common/components/texts/RoundedText';
import SingleHeader from '../../../common/components/texts/SingleHeader';
import HR from '../../../common/components/views/HR';
import Pill from '../../../common/components/views/Pill';
import OrderMap from '../../../common/screens/orders/OrderMap';
import PlaceSummary from '../../../common/screens/orders/summary/PlaceSummary';
import { useCourierReview } from '../../../common/store/api/courier/hooks/useCourierReview';
import useObserveOrder from '../../../common/store/api/order/hooks/useObserveOrder';
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
  const { order } = useObserveOrder(orderId);
  const [tip, setTip] = React.useState(0);
  const [reviewType, setReviewType] = React.useState<ReviewType>();
  const [comment, setComment] = React.useState('');
  const review = useCourierReview(orderId, order?.courier?.id);
  const [isLoading, setLoading] = React.useState(false);

  if (!order) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }

  // handlers
  const tipHandler = async () => {
    setLoading(true);
    try {
      if (tip > 0) await api.order().tipCourier(order.id, tip);
      dispatch(showToast(t('Caixinha enviada!')));
    } catch (error) {
      dispatch(showToast(t('Não foi possível enviar a caixinha')));
    }
    setLoading(false);
  };

  const reviewHandler = async () => {
    setLoading(true);
    try {
      if (reviewType) {
        await api.courier().addReview(order.courier!.id, {
          type: reviewType,
          orderId,
          comment,
        });
      }
    } catch (error) {
      dispatch(showToast(t('Não foi possível enviar a avaliação')));
    }
    setLoading(false);
  };

  // const placeOrderHandler = () => {
  //   if (order.type === 'p2p') {
  //     navigation.navigate('')
  //   }
  // }

  return (
    <View style={{ ...screens.default }}>
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        <OrderMap order={order} ratio={360 / 160} />
        {order.status === 'canceled' ? (
          <View>
            <View style={{ paddingVertical: halfPadding }}>
              <SingleHeader title={t('Pedido cancelado')} />
            </View>
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
        <HR height={padding} />
        {order.type === 'food' && (
          <View>
            <DeliveredItems order={order} />
            <HR height={padding} />
          </View>
        )}
        {order.status !== 'canceled' ? (
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pill />
              <PaddedView
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={{ ...texts.md, ...texts.bold }}>{t('Total pago')}</Text>
                <Text style={{ ...texts.xl }}>
                  {formatCurrency((order.fare?.consumer.total ?? 0) + (order.tip?.value ?? 0))}
                </Text>
              </PaddedView>
            </View>
            <HR height={padding} />
            <PaddedView>
              <OrderCostBreakdown order={order} selectedFare={order.fare} />
            </PaddedView>
            <HR height={padding} />
            <ReviewBox
              review={review?.type ?? reviewType}
              comment={review?.comment ?? comment}
              editable={!review}
              focusable={!!review}
              onReviewChange={(type) => setReviewType(type)}
              onCommentChange={(value) => setComment(value)}
            />
            <DefaultButton
              title={review?.type ? t('Avaliação enviada') : t('Avaliar entregador')}
              onPress={reviewHandler}
              style={{ margin: padding }}
              activityIndicator={isLoading}
              disabled={isLoading || !!review?.type}
            />
            <HR height={padding} />
            <View>
              <TipControl
                order={order}
                tip={tip}
                onChange={(value) => setTip(value)}
                onConfirm={tipHandler}
              />
            </View>
            <HR height={padding} />
            <PaddedView>
              <DefaultButton
                title={t('Relatar um problema')}
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
        ) : (
          <PaddedView>
            <DefaultButton title={t('Refazer pedido')} />
          </PaddedView>
        )}
      </ScrollView>
    </View>
  );
};
