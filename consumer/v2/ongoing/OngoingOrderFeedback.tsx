import { Flavor, ReviewType } from '@appjusto/types';
import { MaterialIcons } from '@expo/vector-icons';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Keyboard, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import HR from '../../../common/components/views/HR';
import { useChatisEnabled } from '../../../common/hooks/useChatIsEnabled';
import { IconOrderDone } from '../../../common/icons/icon-order-done';
import { useCourierReview } from '../../../common/store/api/courier/hooks/useCourierReview';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { track, useSegmentScreen } from '../../../common/store/api/track';
import { showToast } from '../../../common/store/ui/actions';
import { colors, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { DeliveredItems } from '../common/DeliveredItems';
import { ReviewBox } from '../common/review/ReviewBox';
import TipControl from '../common/TipControl';
import { LoggedNavigatorParamList } from '../types';
import { OngoingOrderNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingOrderNavigatorParamList, 'OngoingOrderFeedback'>,
  StackNavigationProp<LoggedNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<OngoingOrderNavigatorParamList, 'OngoingOrderFeedback'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default ({ navigation, route }: Props) => {
  // params
  const { orderId } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // screen state
  const order = useObserveOrder(orderId);
  const [reviewType, setReviewType] = React.useState<ReviewType>();
  const review = useCourierReview(orderId, order?.courier?.id);
  const [comment, setComment] = React.useState('');
  const [tip, setTip] = React.useState(0);
  const [isLoading, setLoading] = React.useState(false);
  const showChatButton = useChatisEnabled(order);
  // tracking
  useSegmentScreen('OngoingOrderFeedback');
  // helpers
  const openChat = React.useCallback(
    (counterpartId: string, counterpartFlavor: Flavor) => {
      navigation.navigate('OngoingOrderChat', {
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
  //handlers
  const finishHandler = async () => {
    Keyboard.dismiss();
    if (!order) return;
    setLoading(true);
    try {
      if (reviewType) {
        track('sending courier review');
        await api.courier().addReview(order.courier!.id, {
          type: reviewType,
          orderId,
          comment,
        });
      }
      if (tip > 0) {
        track('sending tip');
        await api.order().tipCourier(order.id, tip);
      }
      navigation.navigate('MainNavigator', { screen: 'Home' });
    } catch (error) {
      // find a better error message
      dispatch(showToast(t('Não foi possível enviar a avaliação e/ou caixinha'), 'error'));
    }
    setLoading(false);
  };
  const issueHandler = () => {
    track('reporting issue');
    Keyboard.dismiss();
    if (!order) return;
    if (order.type === 'food') {
      navigation.navigate('ReportIssue', {
        orderId: order.id,
        issueType: 'consumer-delivered-food-order',
      });
    } else {
      navigation.navigate('ReportIssue', {
        orderId: order.id,
        issueType: 'consumer-delivered-p2p-order',
      });
    }
  };
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
      style={{ ...screens.default, ...screens.headless }}
      scrollIndicatorInsets={{ right: 1 }}
      enableOnAndroid
      enableAutomaticScroll
      keyboardOpeningTime={0}
      keyboardShouldPersistTaps="handled"
    >
      {/* header */}
      <View style={{ paddingHorizontal: padding, paddingBottom: padding }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={[texts.x2l]}>{t('Pedido entregue')}</Text>
          <IconOrderDone />
        </View>
      </View>
      <HR height={padding} />
      {order.type === 'food' && (
        <View>
          <DeliveredItems order={order} />
          <HR height={padding} />
        </View>
      )}
      {order.courier ? (
        <View>
          {/* tip */}
          <TipControl order={order} tip={tip} onChange={(value) => setTip(value)} />
          <View
            style={{
              flexDirection: 'row',
              marginTop: padding,
              paddingHorizontal: padding,
            }}
          >
            <MaterialIcons name="check" size={24} />
            <View style={{ alignItems: 'flex-start', paddingHorizontal: padding }}>
              <Text style={{ ...texts.xs, color: colors.grey700 }}>
                {t('Entregas realizadas perfeitamente')}
              </Text>
              <Text style={{ ...texts.md }}>{order.courier.statistics?.deliveries ?? 0}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 12,
              paddingHorizontal: padding,
            }}
          >
            <MaterialIcons name="thumb-up-off-alt" size={24} />
            <View style={{ alignItems: 'flex-start', paddingHorizontal: padding }}>
              <Text style={{ ...texts.xs, color: colors.grey700 }}>
                {t('Avaliações positivas')}
              </Text>
              <Text style={{ ...texts.md }}>{order.courier.statistics?.positiveReviews ?? 0}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 12,
              paddingHorizontal: padding,
              marginBottom: padding,
            }}
          >
            <MaterialIcons name="thumb-down-off-alt" size={24} />
            <View style={{ alignItems: 'flex-start', paddingHorizontal: padding }}>
              <Text style={{ ...texts.xs, color: colors.grey700 }}>
                {t('Avaliações negativas')}
              </Text>
              <Text style={{ ...texts.md }}>{order.courier.statistics?.negativeReviews ?? 0}</Text>
            </View>
          </View>
          <HR height={padding} />
          {/* review */}
          <ReviewBox
            reviewType={review?.type ?? reviewType}
            comment={review?.comment ?? comment}
            focusable={!!review}
            onReviewChange={(type) => setReviewType(type)}
            onCommentChange={(value) => setComment(value)}
          />
          <HR />
        </View>
      ) : null}
      {/* actions */}
      <View style={{ paddingHorizontal: padding }}>
        {showChatButton && order.type === 'food' ? (
          <DefaultButton
            title={t('Abrir chat com restaurante')}
            onPress={() => openChatWithRestaurant()}
            style={{ marginTop: padding }}
            secondary
          />
        ) : null}
        <DefaultButton
          title={t('Finalizar')}
          onPress={finishHandler}
          activityIndicator={isLoading}
          disabled={isLoading}
          style={{ marginTop: padding }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: padding,
            paddingBottom: padding,
          }}
        >
          <View style={{ width: '49%' }}>
            <DefaultButton title={t('Relatar problema')} secondary onPress={issueHandler} />
          </View>
          <View style={{ width: '49%' }}>
            <DefaultButton
              title={t('Detalhes da corrida')}
              onPress={() => {
                track('navigating to DeliveredOrderDetail');
                navigation.navigate('DeliveredOrderNavigator', {
                  screen: 'DeliveredOrderDetail',
                  params: {
                    orderId,
                  },
                });
              }}
              secondary
            />
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};
