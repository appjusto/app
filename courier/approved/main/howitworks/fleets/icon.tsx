import * as React from 'react';
import Svg, { Circle, Path, SvgProps } from 'react-native-svg';

export const IconFleets = (props: SvgProps) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={64} height={64} fill="none" {...props}>
      <Circle cx={32} cy={32} r={32} fill="#F6F6F6" />
      <Circle cx={27} cy={26} r={3} fill="#FFE493" />
      <Circle cx={39} cy={26} r={3} fill="#FFE493" />
      <Circle cx={33} cy={33} r={3} fill="#FFE493" />
      <Path
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M38 27.16a.605.605 0 0 0-.19 0 2.573 2.573 0 0 1-2.48-2.58c0-1.43 1.15-2.58 2.58-2.58a2.58 2.58 0 0 1 2.58 2.58A2.589 2.589 0 0 1 38 27.16ZM36.97 34.44c1.37.23 2.88-.01 3.94-.72 1.41-.94 1.41-2.48 0-3.42-1.07-.71-2.6-.95-3.97-.71M25.97 27.16c.06-.01.13-.01.19 0a2.573 2.573 0 0 0 2.48-2.58c0-1.43-1.15-2.58-2.58-2.58a2.58 2.58 0 0 0-2.58 2.58c.01 1.4 1.11 2.53 2.49 2.58ZM27 34.44c-1.37.23-2.88-.01-3.94-.72-1.41-.94-1.41-2.48 0-3.42 1.07-.71 2.6-.95 3.97-.71M32 34.63a.605.605 0 0 0-.19 0 2.573 2.573 0 0 1-2.48-2.58c0-1.43 1.15-2.58 2.58-2.58a2.58 2.58 0 0 1 2.58 2.58c-.01 1.4-1.11 2.54-2.49 2.58ZM29.09 37.78c-1.41.94-1.41 2.48 0 3.42 1.6 1.07 4.22 1.07 5.82 0 1.41-.94 1.41-2.48 0-3.42-1.59-1.06-4.22-1.06-5.82 0Z"
      />
    </Svg>
  );
};
