import React from 'react';
import { NativeTouchEvent, NativeSyntheticEvent, TouchableOpacity } from 'react-native';

import ArrowBox from '../ArrowBox';

type Props = {
  onPress: (ev: NativeSyntheticEvent<NativeTouchEvent>) => void;
};

export default function ({ onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <ArrowBox flipped />
    </TouchableOpacity>
  );
}
