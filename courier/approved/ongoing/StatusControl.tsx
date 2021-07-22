import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  LayoutAnimation,
  Text,
  View,
  ViewProps,
} from 'react-native';
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { borders, colors, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';
import SliderButton from './SliderButton';

interface Props extends ViewProps {
  text: string;
  disabled?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  color: string;
}

const { width } = Dimensions.get('window');
const trackHeight = 48;
const thumbWidth = 180;
const marginHorizontal = 0;
const leftmost = 0;
const rightmost = width - thumbWidth - 30;
const threshold = 30;

export const StatusControl = ({
  text,
  disabled,
  isLoading = false,
  onConfirm,
  color,
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
          {!isLoading ? (
            <View
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}
            >
              <Text style={[texts.sm]}>{t('Arrastar')}</Text>
              <Feather
                name="check-circle"
                size={20}
                color={colors.black}
                style={{ marginLeft: 10 }}
              />
            </View>
          ) : (
            <View
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}
            >
              <Text style={[texts.sm, { marginRight: 10, color: colors.grey700 }]}>
                {t('Aguarde')}
              </Text>
              <ActivityIndicator size="small" color={colors.grey700} />
            </View>
          )}
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
            <SliderButton
              title={text}
              style={{ height: trackHeight, width: '82%' }}
              activityIndicator={isLoading}
              disabled={disabled}
              buttonColor={color}
            />
          </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  );
};
