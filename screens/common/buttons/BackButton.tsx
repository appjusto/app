import React from 'react';
import { NativeTouchEvent, NativeSyntheticEvent } from 'react-native';

import ArrowBox from '../ArrowBox';

type Props = {
  onPress: (ev: NativeSyntheticEvent<NativeTouchEvent>) => void;
};

export default function (props: Props) {
  return <ArrowBox flipped />;
}
