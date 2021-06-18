import React, { useState } from 'react';
import { Animated, Image, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { checkToast, errorToast } from '../../../assets/icons';
import { hideToast } from '../../store/ui/actions';
import { getToast } from '../../store/ui/selectors';
import { colors, halfPadding, texts } from '../../styles';

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
        bottom: 24,
        opacity,
        width: '100%',
        minHeight: 48,
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: type === 'success' ? colors.green100 : colors.yellow,
          width: '100%',
          // flexWrap: 'wrap',
          padding: halfPadding,
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          flexDirection: 'row',
        }}
      >
        <View>
          <Image
            source={type === 'success' ? checkToast : errorToast}
            style={{ marginRight: halfPadding }}
          />
        </View>
        <Text style={{ ...texts.xs, flexWrap: 'wrap', maxWidth: '90%' }} numberOfLines={3}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}
