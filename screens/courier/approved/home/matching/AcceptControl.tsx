import Slider from '@react-native-community/slider';
import React, { useCallback, useRef } from 'react';
import { View, Image, Text, ViewProps } from 'react-native';

import * as icons from '../../../../../assets/icons';
import { t } from '../../../../../strings';
import { colors, texts, padding, borders } from '../../../../common/styles';

interface Props extends ViewProps {
  acceptHandler: () => void;
  rejectHandler: () => void;
  disabled: boolean;
}

export default function ({ acceptHandler, rejectHandler, disabled, ...props }: Props) {
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

  const height = 88;
  const delta = 14;
  const trakcHeight = height - delta;
  const top = delta / 2;

  // UI
  return (
    <View style={{ height }} {...props}>
      {/* track */}
      <View
        style={{
          position: 'absolute',
          top,
          height: trakcHeight,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: colors.lightGrey,
          paddingHorizontal: padding * 2,
          borderRadius: 64,
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <Image source={icons.reject} />
          <Text style={[texts.default, { color: colors.darkGrey }]}>{t('Recusar')}</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Image source={icons.accept} />
          <Text style={[texts.default]}>{t('Aceitar')}</Text>
        </View>
      </View>
      {/* slider */}
      <Slider
        ref={sliderRef}
        disabled={disabled}
        style={{ width: '100%', height }}
        minimumValue={0}
        maximumValue={100}
        step={1}
        minimumTrackTintColor="#00000000"
        maximumTrackTintColor="#00000000"
        thumbImage={icons.motocycle}
        value={50}
        onSlidingComplete={completeHandler}
      />
    </View>
  );
}
