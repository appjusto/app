import { Flavor } from '@appjusto/types';
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
import { useChatIsEnabled } from '../../../common/hooks/useChatIsEnabled';
import { IconOrderDone } from '../../../common/icons/icon-order-done';
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
  const [tip, setTip] = React.useState(0);
  const [isLoading, setLoading] = React.useState(false);
  const showChatButton = useChatIsEnabled(order);
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
    track('consumer opening chat with restaurant after order is delivered');
    openChat(order?.business?.id!, 'business');
  }, [openChat, order?.business?.id]);
  const openChatWithCourier = React.useCallback(() => {
    track('consumer chat with courier');
    openChat(order?.courier?.id!, 'courier');
  }, [openChat, order?.courier?.id]);
  //handlers
  const openChatHandler = () => {
    if (!order) return;
    if (order.type === 'food') {
      openChatWithRestaurant();
    } else if (order.type === 'p2p') {
      openChatWithCourier();
    }
  };
  const finishHandler = async () => {
    setLoading(true);
    if (!tip) {
      setLoading(false);
      navigation.navigate('MainNavigator', { screen: 'Home' });
      return;
    }
    if (!order) return;
    try {
      track('sending tip');
      await api.order().tipCourier(order.id, tip);
      dispatch(showToast(t('Caixinha enviada!'), 'success'));
      setLoading(false);
      navigation.navigate('MainNavigator', { screen: 'Home' });
    } catch (error) {
      setLoading(false);
      // find a better error message
      dispatch(showToast(t('Não foi possível enviar a caixinha'), 'error'));
    }
  };
  const issueHandler = () => {
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
      contentContainerStyle={{ flexGrow: 1 }}
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
      {order.type === 'food' ? (
        <View>
          <DeliveredItems order={order} />
          <HR height={padding} />
        </View>
      ) : null}
      {order.courier?.id ? (
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
          <ReviewBox order={order} onCompleteReview={finishHandler} screen="OngoingOrderFeedback">
            {showChatButton ? (
              <DefaultButton
                title={
                  order.type === 'food'
                    ? t('Abrir chat com restaurante')
                    : t('Abrir chat com o entregador')
                }
                onPress={openChatHandler}
                // style={{ marginTop: padding }}
                variant="secondary"
              />
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: padding,
              }}
            >
              <View style={{ width: '47%' }}>
                <DefaultButton
                  title={t('Relatar problema')}
                  variant="danger"
                  onPress={issueHandler}
                />
              </View>
              <View style={{ width: '47%' }}>
                <DefaultButton
                  title={t('Detalhes')}
                  onPress={() => {
                    navigation.navigate('DeliveredOrderNavigator', {
                      screen: 'DeliveredOrderDetail',
                      params: {
                        orderId,
                      },
                    });
                  }}
                  variant="secondary"
                />
              </View>
            </View>
          </ReviewBox>
          {/* <HR /> */}
        </View>
      ) : (
        <View>
          {/* review */}
          <ReviewBox order={order} onCompleteReview={finishHandler} screen="OngoingOrderFeedback">
            {showChatButton ? (
              <DefaultButton
                title={
                  order.type === 'food'
                    ? t('Abrir chat com restaurante')
                    : t('Abrir chat com o entregador')
                }
                onPress={openChatHandler}
                // style={{ marginTop: padding }}
                variant="secondary"
              />
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: padding,
              }}
            >
              <View style={{ width: '47%' }}>
                <DefaultButton
                  title={t('Relatar problema')}
                  variant="danger"
                  onPress={issueHandler}
                />
              </View>
              <View style={{ width: '47%' }}>
                <DefaultButton
                  title={t('Detalhes')}
                  onPress={() => {
                    navigation.navigate('DeliveredOrderNavigator', {
                      screen: 'DeliveredOrderDetail',
                      params: {
                        orderId,
                      },
                    });
                  }}
                  variant="secondary"
                />
              </View>
            </View>
          </ReviewBox>
          <HR />
        </View>
      )}
      <View style={{ flex: 1 }} />
    </KeyboardAwareScrollView>
  );
};
