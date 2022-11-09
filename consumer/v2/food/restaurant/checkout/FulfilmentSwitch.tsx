import { Fulfillment } from '@appjusto/types';
import React from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  LayoutAnimation,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import * as Sentry from 'sentry-expo';
import { ApiContext } from '../../../../../common/app/context';
import { useContextActiveOrder } from '../../../../../common/store/context/order';
import { colors, doublePadding, halfPadding, padding, screens } from '../../../../../common/styles';
import SliderButton from '../../../../../courier/approved/ongoing/SliderButton';
import { t } from '../../../../../strings';
type Props = {
  orderId: string;
};

const { width } = Dimensions.get('window');
const trackHeight = 48;
const thumbSize = width / 2 - doublePadding;
const center = (width - thumbSize) * 0.4;
const leftmost = 0;
const rightmost = width - width / 2 - halfPadding;
const threshold = 40;

export const FulfillmentSwitch = ({ orderId }: Props) => {
  // context
  const api = React.useContext(ApiContext);
  const order = useContextActiveOrder();
  // state
  const [translateX, setTranslateX] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [orderFulfillment, setOrderFulfillment] = React.useState<Fulfillment>(
    order?.fulfillment ?? 'delivery'
  );
  // side effects
  // remembering previous selection of fulfillment if user leaves checkout and comes back
  // when loading component for the first time
  React.useEffect(() => {
    if (order?.fulfillment === 'delivery') setTranslateX(leftmost);
    if (order?.fulfillment === 'take-away') setTranslateX(rightmost);
  }, []);
  // UI handlers
  const onGestureEvent = (event: GestureEvent<PanGestureHandlerEventPayload>) => {
    const { translationX } = event.nativeEvent;
    if (translationX >= leftmost && translationX <= rightmost) setTranslateX(translationX);
  };
  const onGestureEnded = async () => {
    try {
      const takeAway = translateX > center + threshold && translateX < rightmost;
      const delivery = translateX < center + threshold;
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      if (delivery) {
        setOrderFulfillment('delivery');
        setTranslateX(leftmost);
        setLoading(true);
        await api.order().updateOrder(orderId, { fulfillment: 'delivery' });
        setLoading(false);
      } else if (takeAway) {
        setOrderFulfillment('take-away');
        setTranslateX(rightmost);
        setLoading(true);
        await api.order().updateOrder(orderId, { fulfillment: 'take-away' });
        setLoading(false);
      } else {
        setTranslateX(0);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      Sentry.Native.captureException(error);
    }
  };
  const onDelivery = async () => {
    try {
      setOrderFulfillment('delivery');
      setTranslateX(leftmost);
      setLoading(true);
      await api.order().updateOrder(orderId, { fulfillment: 'delivery' });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      Sentry.Native.captureException(error);
    }
  };
  const onTakeAway = async () => {
    try {
      setOrderFulfillment('take-away');
      setTranslateX(rightmost);
      setLoading(true);
      await api.order().updateOrder(orderId, { fulfillment: 'take-away' });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      Sentry.Native.captureException(error);
    }
  };
  // UI
  if (!order) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="small" color={colors.green500} />
      </View>
    );
  }
  return (
    <View
      style={{
        padding,
        backgroundColor: colors.white,
      }}
    >
      <View>
        {/* track */}
        <View
          style={{
            height: 56,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: doublePadding,
            backgroundColor: colors.green700,
            borderRadius: 28,
            width: '100%',
          }}
        >
          <TouchableOpacity
            onPress={onDelivery}
            style={{
              width: '50%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
          >
            <Text style={{ color: colors.white }}>🛵 {t('Entregar')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onTakeAway}
            style={{
              width: '50%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}
          >
            <Text style={{ color: colors.white }}>🚶‍♂️ {t('Retirar')}</Text>
          </TouchableOpacity>
        </View>
        <PanGestureHandler onGestureEvent={onGestureEvent} onEnded={onGestureEnded}>
          <Animated.View
            style={{
              position: 'absolute',
              left: leftmost,
              transform: [{ translateX }],
              paddingTop: 4,
              paddingHorizontal: 4,
            }}
          >
            <SliderButton
              title={orderFulfillment === 'delivery' ? '🛵  Entregar' : 'Retirar 🚶‍♂️'}
              style={{ height: trackHeight, width: thumbSize, borderRadius: 28 }}
              activityIndicator={loading}
              buttonColor={colors.green100}
              rightIcon={false}
            />
          </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  );
};
