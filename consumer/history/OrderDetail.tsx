import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ReviewType } from 'appjusto-types';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../common/app/context';
import DefaultButton from '../../common/components/buttons/DefaultButton';
import PaddedView from '../../common/components/containers/PaddedView';
import RoundedText from '../../common/components/texts/RoundedText';
import HR from '../../common/components/views/HR';
import Pill from '../../common/components/views/Pill';
import { useCourierReview } from '../../common/store/api/courier/hooks/useCourierReview';
import useObserveOrder from '../../common/store/api/order/hooks/useObserveOrder';
import { showToast } from '../../common/store/ui/actions';
import { colors, halfPadding, padding, screens, texts } from '../../common/styles';
import {
  formatCurrency,
  formatDistance,
  formatDuration,
  separateWithDot,
} from '../../common/utils/formatters';
import { t } from '../../strings';
import TipControl from '../home/orders/common/TipControl';
import { ReviewBox } from '../home/orders/components/ReviewBox';
import OrderMap from '../home/orders/p2p-order/OrderMap';
import PlaceSummary from '../home/orders/p2p-order/PlaceSummary';
import { OrderCostBreakdown } from '../home/orders/summary/breakdown/OrderCostBreakdown';
import { HistoryParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<HistoryParamList, 'OrderDetail'>;
type ScreenRoute = RouteProp<HistoryParamList, 'OrderDetail'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export default function ({ navigation, route }: Props) {
  // context
  const { orderId } = route.params;
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // screen state
  const { order } = useObserveOrder(orderId);
  const [tip, setTip] = React.useState();
  const [reviewType, setReviewType] = React.useState<ReviewType>();
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
  const finishHandler = async () => {
    setLoading(true);
    try {
      if (reviewType) {
        await api.courier().addReview(order.courier!.id, {
          type: reviewType,
          orderId,
        });
      }
      if (tip > 0) await api.order().tipCourier(order.id, tip);
      navigation.navigate('Home');
    } catch (error) {
      // find a better error message
      dispatch(showToast(t('Não foi possível enviar a avaliação e/ou caixinha')));
    }
    setLoading(false);
  };

  return (
    <View style={{ ...screens.default }}>
      <ScrollView>
        <View style={{ height: 160 }}>
          <OrderMap order={order} />
        </View>
        <PaddedView>
          <PlaceSummary title={t('Retirada')} place={order.origin} />
          <PlaceSummary title={t('Entrega')} place={order.destination} />
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
        <ReviewBox review={review?.type} onReviewChange={(type) => setReviewType(type)} />
        <HR height={padding} />
        {order.tip?.value! > 0 ? (
          <View>
            <TipControl order={order} tip={tip} onChange={(value) => setTip(value)} />
          </View>
        ) : (
          <View>
            <TipControl
              order={order}
              tip={tip}
              onChange={(value) => setTip(value)}
              onConfirm={tipHandler}
            />
          </View>
        )}
        <HR height={padding} />
        <PaddedView>
          <OrderCostBreakdown order={order} selectedFare={order.fare} />
        </PaddedView>
        <HR height={padding} />
        <PaddedView>
          <DefaultButton
            title={t('Finalizar')}
            onPress={finishHandler}
            style={{ marginBottom: padding }}
          />
          <DefaultButton
            title={t('Relatar um problema')}
            onPress={() => navigation.navigate('OrderComplaint', { orderId: order.id })}
            secondary
          />
        </PaddedView>
      </ScrollView>
    </View>
  );
}
