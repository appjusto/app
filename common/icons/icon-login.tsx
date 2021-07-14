import * as React from 'react';
import Svg, { Circle, ClipPath, Defs, G, Path, SvgProps } from 'react-native-svg';

export const IconLogin = (props: SvgProps) => {
  return (
    <Svg width={64} height={64} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Circle cx={32} cy={32} r={32} fill="#F6F6F6" />
      <Path
        d="M28.084 50.417c9.895 0 17.917-8.022 17.917-17.917 0-9.895-8.022-17.916-17.917-17.916-9.895 0-17.916 8.021-17.916 17.916s8.021 17.917 17.916 17.917z"
        fill="#FFE493"
      />
      <G clipPath="url(#prefix__clip0)" stroke="#000" strokeWidth={1.1} strokeMiterlimit={10}>
        <Path d="M9 32.5h27.6" strokeLinecap="round" />
        <Path d="M32.084 51.277c10.37 0 18.777-8.407 18.777-18.777 0-10.37-8.407-18.777-18.777-18.777-10.37 0-18.777 8.407-18.777 18.777 0 10.37 8.406 18.777 18.777 18.777zm-1.006-14.666l5.504-4.111m0 0l-5.504-4.112" />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0">
          <Path fill="#fff" transform="translate(9 10)" d="M0 0h45v45H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
