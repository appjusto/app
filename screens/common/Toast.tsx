import React, { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, Animated } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { hideToast } from '../../store/ui/actions';
import { getToastMessage, getToastType } from '../../store/ui/selectors';
import { colors, texts } from './styles';

const percentualWidth = 0.8;
const duration = 500;
const delay = 4000;

export default function () {
  // context
  const { width, height } = useWindowDimensions();
  const dispatch = useDispatch();

  // data
  const message = useSelector(getToastMessage);
  const type = useSelector(getToastType);

  // state
  const [top] = useState(new Animated.Value(height));

  if (!message) return null;

  const background = {
    backgroundColor: type === 'success' ? colors.green : colors.yellow,
  };
  const size = {
    height: 40,
    width: width * percentualWidth,
  };
  const left = (width - size.width) * 0.5;

  Animated.sequence([
    Animated.timing(top, {
      useNativeDriver: false,
      toValue: height - size.height,
      duration,
    }),
    Animated.timing(top, {
      useNativeDriver: false,
      delay,
      toValue: height,
      duration,
    }),
  ]).start(() => dispatch(hideToast()));

  return (
    <Animated.View style={{ ...style.container, ...background, ...size, left, top }}>
      <Text style={style.text} numberOfLines={2}>
        {message}
      </Text>
    </Animated.View>
  );
}

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  text: {
    // borderWidth: 1,
    ...texts.small,
  },
});
