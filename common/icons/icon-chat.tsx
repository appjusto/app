import * as React from 'react';
import Svg, { Circle, Path, SvgProps } from 'react-native-svg';

export const IconChat = (props: SvgProps) => {
  return (
    <Svg width={40} height={40} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Circle cx={20} cy={20} r={19.5} fill="#6CE787" stroke="#000" />
      <Path
        d="M26.666 27.5v-1.667a3.333 3.333 0 00-3.333-3.333h-6.667a3.333 3.333 0 00-3.333 3.333V27.5M20 20.167a3.333 3.333 0 100-6.667 3.333 3.333 0 000 6.667z"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
