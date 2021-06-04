import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Animated, Dimensions, LayoutAnimation, Text, View, ViewProps } from 'react-native';
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import { borders, colors, halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

interface Props extends ViewProps {
  text: string;
  disabled?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
}

const { width } = Dimensions.get('window');
const trackHeight = 48;
const thumbWidth = 180;
const marginHorizontal = 0;
const leftmost = 0;
const rightmost = width - thumbWidth - 40;
const threshold = 30;

export const StatusControl = ({
  text,
  disabled,
  isLoading = false,
  onConfirm,
  style,
  ...props
}: Props) => {
  // state
  const [translateX, setTranslateX] = React.useState(0);
  const [confirmed, setConfirmed] = React.useState(false);
  // UI handlers
  const onGestureEvent = (event: GestureEvent<PanGestureHandlerEventPayload>) => {
    if (disabled || confirmed) return;
    const { translationX } = event.nativeEvent;
    if (translationX >= leftmost && translationX <= rightmost) setTranslateX(translationX);
  };
  const onGestureEnded = () => {
    const shouldConfirm = translateX > 0 && rightmost - translateX < threshold;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (shouldConfirm) {
      setConfirmed(true);
      setTranslateX(rightmost);
      onConfirm();
    } else {
      setTranslateX(0);
    }
  };
  // UI
  return (
    <View style={[null, style]} {...props}>
      <View>
        {/* track */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            height: trackHeight,
            paddingHorizontal: padding,
            marginHorizontal,
            backgroundColor: colors.grey50,
            ...borders.default,
            borderColor: colors.grey50,
          }}
        >
          <Text style={[texts.sm]}>{t('Arrastar')}</Text>
          <Feather name="check-circle" size={20} color={colors.black} style={{ marginLeft: 10 }} />
        </View>
        {/* thumb */}
        <PanGestureHandler onGestureEvent={onGestureEvent} onEnded={onGestureEnded}>
          <Animated.View
            style={{
              position: 'absolute',
              left: leftmost,
              transform: [{ translateX }],
            }}
          >
            <DefaultButton
              title={text}
              style={{ height: trackHeight }}
              activityIndicator={isLoading}
              icon={<Feather name="arrow-right" size={14} style={{ marginLeft: halfPadding }} />}
              disabled={disabled}
            />
          </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  );
};
