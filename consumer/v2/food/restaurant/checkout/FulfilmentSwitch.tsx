import { Fulfillment } from '@appjusto/types';
import React from 'react';
import { Animated, Dimensions, LayoutAnimation, Text, View } from 'react-native';
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { colors, doublePadding, padding } from '../../../../../common/styles';
import SliderButton from '../../../../../courier/approved/ongoing/SliderButton';
import { t } from '../../../../../strings';

interface FulfillmentSwitchProps {
  fulfillment: Fulfillment;
  onDelivery?: () => void;
  onTakeAway?: () => void;
  onChangeHandler: (value: Fulfillment) => void;
}

const { width } = Dimensions.get('window');
const trackHeight = 48;
const thumbWidth = 180;
// const marginHorizontal = 0;
const leftmost = 0;
const rightmost = width - thumbWidth;
const threshold = 30;

export const FulfillmentSwitch = ({ fulfillment, onChangeHandler }: FulfillmentSwitchProps) => {
  // state
  const [translateX, setTranslateX] = React.useState(0);
  const [orderFulfillment, setOrderFulfillment] = React.useState<Fulfillment>(fulfillment);
  // UI handlers
  const onGestureEvent = (event: GestureEvent<PanGestureHandlerEventPayload>) => {
    const { translationX } = event.nativeEvent;
    if (translationX >= leftmost && translationX <= rightmost) setTranslateX(translationX);
  };
  const onGestureEnded = () => {
    const shouldConfirm = translateX > 0 && rightmost - translateX < threshold;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (shouldConfirm) {
      setTranslateX(rightmost);
      onChangeHandler('take-away');
    } else {
      setTranslateX(leftmost);
      onChangeHandler('delivery');
      setTranslateX(0);
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
          <Text style={{ color: colors.white }}>{t('Entregar')}</Text>
          <Text style={{ color: colors.white }}>{t('Retirar')}</Text>
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
              title={fulfillment === 'delivery' ? 'Entregar' : 'Retirar'}
              style={{ height: trackHeight, width: '81%', borderRadius: 28 }}
              // activityIndicator={confirmed}
              buttonColor={colors.green100}
              rightIcon={false}
            />
          </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  );
};
