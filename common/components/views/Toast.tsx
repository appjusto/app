import React, { useState } from 'react';
import { Text, Animated, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { hideToast } from '../../store/ui/actions';
import { getToast } from '../../store/ui/selectors';
import { borders, colors, halfPadding, padding, texts } from '../../styles';

// const percentualWidth = 0.8;
const duration = 250;
const delay = 3000;

export default function () {
  // context
  const dispatch = useDispatch();

  // state
  const { message, type, autoHide } = useSelector(getToast);
  const [opacity] = useState(new Animated.Value(0));

  // UI
  if (!message) return null;

  if (autoHide) {
    Animated.sequence([
      Animated.timing(opacity, {
        useNativeDriver: false,
        toValue: 1,
        duration,
      }),
      Animated.timing(opacity, {
        useNativeDriver: false,
        delay,
        toValue: 0,
        duration,
      }),
    ]).start(() => dispatch(hideToast()));
  }

  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: 40,
        left: padding,
        right: padding,
        opacity,
      }}
    >
      <View
        style={{
          ...borders.default,
          ...borders.rounder,
          ...borders.thicker,
          borderColor: colors.black,
          backgroundColor: type === 'success' ? colors.green : colors.yellow,
          width: '100%',
          // flexWrap: 'wrap',
          padding: halfPadding,
          // alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        <Text style={{ ...texts.small, flexWrap: 'wrap' }} numberOfLines={2}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}
