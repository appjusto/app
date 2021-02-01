import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import React, { useCallback, useRef } from 'react';
import { Dimensions, Text, View, ViewProps } from 'react-native';
import { borders, colors, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

interface Props extends ViewProps {
  acceptHandler: () => void;
  rejectHandler: () => void;
  disabled: boolean;
}

export default function ({ acceptHandler, rejectHandler, disabled }: Props) {
  // refs
  const sliderRef = useRef<Slider>(null);
  // helpers
  const updateSliderValue = (value: number) => sliderRef.current?.setNativeProps({ value });
  // handlers
  const completeHandler = useCallback((value) => {
    if (value <= 10) {
      updateSliderValue(0);
      rejectHandler();
    } else if (value >= 90) {
      updateSliderValue(100);
      acceptHandler();
    } else {
      updateSliderValue(50);
    }
  }, []);

  // couldn't get track to stick with "width: '100%'", probably because its absolute positioning;
  // using device's width instead
  const { width } = Dimensions.get('window');
  const paddingHorizontal = padding * 2;
  // height of the component is based on the thumb height
  // delta is how much the thumb is taller than the track
  const height = 88;
  const delta = 14;
  const trackHeight = height - delta;
  const top = delta / 2;

  // UI
  return (
    <View style={{ height, paddingHorizontal }}>
      {/* track */}
      <View
        style={{
          position: 'absolute',
          top,
          width: width - paddingHorizontal,
          height: trackHeight,
          // flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: colors.lightGrey,
          paddingHorizontal,
          ...borders.default,
          borderRadius: 64,
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <Feather name="x" size={20} color={colors.darkGrey} />
          <Text style={[texts.default, { color: colors.darkGrey }]}>{t('Recusar')}</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Feather name="check-circle" size={20} color={colors.black} />
          <Text style={[texts.default]}>{t('Aceitar')}</Text>
        </View>
      </View>
      {/* slider */}
      <Slider
        ref={sliderRef}
        style={{ width: '100%', height }}
        minimumValue={0}
        maximumValue={100}
        step={1}
        minimumTrackTintColor="#00000000"
        maximumTrackTintColor="#00000000"
        value={50}
        onSlidingComplete={completeHandler}
      />
    </View>
  );
}
