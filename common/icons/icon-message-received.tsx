import * as React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, SvgProps } from 'react-native-svg';
import { colors } from '../styles';

export const IconMessageReceived = (props: SvgProps) => {
  return (
    <View
      style={{
        height: 64,
        width: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
      }}
    >
      <Svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <Path
          d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.381 8.381 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
          stroke="#000"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx={18.75} cy={5.25} r={5.25} fill="#6CE787" />
      </Svg>
    </View>
  );
};
