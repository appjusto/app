import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import React, { useCallback, useRef } from 'react';
import { Text, View, ViewProps } from 'react-native';
import { borders, colors, texts } from '../../../common/styles';

interface Props extends ViewProps {
  nextStepHandler: () => void;
  status: string;
}

export default function ({ nextStepHandler, status }: Props) {
  // refs
  const sliderRef = useRef<Slider>(null);
  // helpers
  const updateSliderValue = (value: number) => sliderRef.current?.setNativeProps({ value });
  // handlers
  const completeHandler = useCallback((value) => {
    if (value <= 10) {
      updateSliderValue(0);
    } else if (value >= 90) {
      updateSliderValue(100);
      nextStepHandler();
    } else {
      updateSliderValue(50);
    }
  }, []);

  // const { width } = Dimensions.get('window');

  return (
    <View style={{ height: 48, width: '100%' }}>
      {/* track */}
      <View
        style={{
          // position: 'absolute',
          width: '100%',
          height: 48,
          // flex: 1,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          // alignItems: 'center',
          backgroundColor: colors.lightGrey,
          // paddingHorizontal,
          ...borders.default,
          // borderRadius: 64,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[texts.default]}>{status}</Text>
          <Feather name="check-circle" size={20} color={colors.black} style={{ marginLeft: 10 }} />
        </View>
      </View>
      {/* slider */}
      {/* <Slider
        ref={sliderRef}
        style={{ width: '100%', height: 48 }}
        minimumValue={0}
        maximumValue={100}
        step={1}
        minimumTrackTintColor="#00000000"
        maximumTrackTintColor="#00000000"
        value={0}
        onSlidingComplete={completeHandler}
        thumbImage={icons.slideConfirm}
      /> */}
    </View>
  );
}
