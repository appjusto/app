import * as React from 'react';
import Svg, { Circle, Path, SvgProps } from 'react-native-svg';

export const IconRevenue = (props: SvgProps) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={64} height={64} fill="none" {...props}>
      <Circle cx={32} cy={32} r={32} fill="#F6F6F6" />
      <Circle cx={33.2} cy={33.2} r={10} fill="#FFE493" />
      <Path
        stroke="#292D32"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M29.5 33.75c0 .97.75 1.75 1.67 1.75h1.88c.8 0 1.45-.68 1.45-1.53 0-.91-.4-1.24-.99-1.45l-3.01-1.05c-.59-.21-.99-.53-.99-1.45 0-.84.65-1.53 1.45-1.53h1.88c.92 0 1.67.78 1.67 1.75M32 27.5v9"
      />
      <Path
        stroke="#292D32"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M42 32c0 5.52-4.48 10-10 10s-10-4.48-10-10 4.48-10 10-10"
      />
      <Path
        stroke="#292D32"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M37 23v4h4M42 22l-5 5"
      />
    </Svg>
  );
};
