import { Fulfillment } from '@appjusto/types';
import React from 'react';
import { Animated, Dimensions, LayoutAnimation, Text, View } from 'react-native';
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import * as Sentry from 'sentry-expo';
import { ApiContext } from '../../../../../common/app/context';
import { colors, doublePadding, padding } from '../../../../../common/styles';
import SliderButton from '../../../../../courier/approved/ongoing/SliderButton';
import { t } from '../../../../../strings';
type Props = {
  fulfillment: Fulfillment;
  orderId: string;
};

const { width } = Dimensions.get('window');
const trackHeight = 48;
const thumbWidth = width / 2 - doublePadding;
// const marginHorizontal = 0;
const leftmost = 0;
const rightmost = width - doublePadding;
const threshold = doublePadding;

export const FulfillmentSwitch = ({ fulfillment, orderId }: Props) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [translateX, setTranslateX] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [takeAwayFulfillment, setTakeAwayFulfillment] = React.useState(false);
  const [deliveryFulfillment, setDeliveryFulfillment] = React.useState(true);
  // UI handlers
  const onGestureEvent = (event: GestureEvent<PanGestureHandlerEventPayload>) => {
    const { translationX } = event.nativeEvent;
    if (translationX >= leftmost && translationX <= rightmost) setTranslateX(translationX);
  };
  const onGestureEnded = async () => {
    try {
      const takeAway = translateX > 0 && rightmost - translateX < threshold;
      // const delivery = translateX === 0;
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      if (translateX === 0) {
        setTranslateX(leftmost);
        // setOrderFulfillment('take-away');
        setDeliveryFulfillment(true);
        if (fulfillment !== 'delivery') {
          setLoading(true);
          await api.order().updateOrder(orderId, { fulfillment: 'take-away' });
          setLoading(false);
        }
      } else if (takeAway) {
        setTranslateX(rightmost);
        // setOrderFulfillment('delivery');
        setTakeAwayFulfillment(true);
        setLoading(true);
        await api.order().updateOrder(orderId, { fulfillment: 'delivery' });
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
  // UI
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
          }}
        >
          <Text style={{ color: colors.white }}>🛵 {t('Entregar')}</Text>
          <Text style={{ color: colors.white }}>🚶‍♂️ {t('Retirar')}</Text>
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
              title={deliveryFulfillment ? '🛵  Entregar' : 'Retirar 🚶‍♂️'}
              style={{ height: trackHeight, width: thumbWidth, borderRadius: 28 }}
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
