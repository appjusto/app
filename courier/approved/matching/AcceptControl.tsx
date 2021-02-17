import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Animated, Dimensions, LayoutAnimation, Text, View, ViewProps } from 'react-native';
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { IconMotocycle } from '../../../common/icons/icon-motocycle';
import { borders, colors, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

interface Props extends ViewProps {
  onAccept: () => void;
  onReject: () => void;
}

const { width } = Dimensions.get('window');
const trackHeight = 88;
const thumbSize = 114;
const center = (width - thumbSize) * 0.5;
const marginHorizontal = 0;
const leftmost = (center - marginHorizontal) * -1;
const rightmost = center - marginHorizontal - 30;
const threshold = 30;

export const AcceptControl = ({ onAccept, onReject, style, ...props }: Props) => {
  // state
  const [translateX, setTranslateX] = React.useState(0);
  const [accepted, setAccepted] = React.useState(false);
  const [rejected, setRejected] = React.useState(false);
  // UI handlers
  const onGestureEvent = (event: GestureEvent<PanGestureHandlerEventPayload>) => {
    if (accepted || rejected) return;
    const { translationX } = event.nativeEvent;
    if (translationX >= leftmost && translationX <= rightmost) setTranslateX(translationX);
  };
  const onGestureEnded = () => {
    const shouldReject = translateX < 0 && translateX - leftmost < threshold;
    const shouldAccept = translateX > 0 && rightmost - translateX < threshold;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (shouldReject) {
      setRejected(true);
      setTranslateX(leftmost);
      onReject();
    } else if (shouldAccept) {
      setAccepted(true);
      setTranslateX(rightmost);
      onAccept();
    } else {
      setTranslateX(0);
    }
  };
  // UI
  return (
    <View style={[null, style]} {...props}>
      {/* track */}
      <View style={{}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: trackHeight,
            paddingHorizontal: padding * 2,
            marginHorizontal,
            backgroundColor: colors.grey50,
            ...borders.default,
            borderRadius: 64,
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Feather name="x" size={20} color={colors.grey700} />
            <Text style={[texts.sm, { color: colors.grey700 }]}>{t('Recusar')}</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Feather name="check-circle" size={20} color={colors.black} />
            <Text style={[texts.sm]}>{t('Aceitar')}</Text>
          </View>
        </View>
        {/* thumb */}
        <PanGestureHandler onGestureEvent={onGestureEvent} onEnded={onGestureEnded}>
          <Animated.View
            style={{
              position: 'absolute',
              top: -12,
              left: center,
              transform: [{ translateX }],
            }}
          >
            <IconMotocycle
              circleColor={rejected ? colors.yellow : colors.green500}
              flipped={!rejected}
            />
          </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  );
};
