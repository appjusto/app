import { Fulfillment } from '@appjusto/types';
import React from 'react';
import { Animated, Dimensions, LayoutAnimation, Text, View } from 'react-native';
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { colors, doublePadding, halfPadding, padding } from '../../../../../common/styles';
import SliderButton from '../../../../../courier/approved/ongoing/SliderButton';
import { t } from '../../../../../strings';

interface FulfillmentSwitchProps {
  fulfillment: Fulfillment;
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
      onChangeHandler('delivery');
      setTranslateX(0);
    }
  };
  // UI
  return (
    <View
      style={{
        paddingVertical: padding,
        paddingHorizontal: halfPadding,
        marginBottom: halfPadding,
        backgroundColor: colors.white,
      }}
    >
      <View
        style={{
          height: 60,
          padding: halfPadding,
          backgroundColor: colors.green700,
          borderRadius: 30,
        }}
      >
        <View style={{ position: 'relative' }}>
          <View
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: doublePadding,
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
              }}
            >
              <SliderButton
                title={fulfillment === 'delivery' ? 'Entregar' : 'Retirar'}
                style={{ height: trackHeight, width: '81%', borderRadius: 30 }}
                // activityIndicator={confirmed}
                buttonColor={colors.green100}
              />
            </Animated.View>
          </PanGestureHandler>
        </View>
      </View>
    </View>
  );
};
