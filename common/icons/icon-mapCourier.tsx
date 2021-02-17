import * as React from 'react';
import Svg, { Circle, Defs, G, SvgProps } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

export const IconMapCourier = (props: SvgProps) => {
  return (
    <Svg width={40} height={44} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Circle opacity={0.7} cx={20} cy={16} r={15.5} fill="#B8E994" stroke="#fff" />
      <G filter="url(#prefix__filter0_d)">
        <Circle cx={20} cy={16} r={8} fill="#fff" />
        <Circle cx={20} cy={16} r={6.5} stroke="#78E08F" strokeWidth={3} />
      </G>
      <Defs></Defs>
    </Svg>
  );
};
