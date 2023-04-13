import * as React from 'react';
import Svg, { Circle, ClipPath, Defs, G, Path, SvgProps } from 'react-native-svg';

export const AppJustoOnlyIcon = ({ width = 40, height = 40, ...props }: SvgProps) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" {...props}>
      <Path
        fill="#6CE787"
        d="m19.5.5 5.335 4.84 7.2-.278.975 7.138 5.694 4.414-3.841 6.095 1.525 7.041-6.86 2.2-3.359 6.374L19.5 35.6l-6.67 2.724-3.357-6.374-6.86-2.2 1.524-7.041-3.84-6.095L5.99 12.2l.976-7.138 7.199.279L19.5.5Z"
      />
      <Path
        stroke="#000"
        d="m19.5.5 5.335 4.84 7.2-.278.975 7.138 5.694 4.414-3.841 6.095 1.525 7.041-6.86 2.2-3.359 6.374L19.5 35.6l-6.67 2.724-3.357-6.374-6.86-2.2 1.524-7.041-3.84-6.095L5.99 12.2l.976-7.138 7.199.279L19.5.5Z"
      />
      <Circle cx={19.7} cy={19.7} r={11.7} fill="#fff" />
      <G clipPath="url(#a)">
        <Path
          fill="#6CE787"
          d="M24.42 17.805a2.75 2.75 0 0 0-3.89 0l-.53.53-.53-.53a2.75 2.75 0 0 0-3.89 3.89l.53.53 3.89 3.89 3.89-3.89.53-.53a2.748 2.748 0 0 0 0-3.89Z"
        />
        <Path
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M24.42 16.305a2.75 2.75 0 0 0-3.89 0l-.53.53-.53-.53a2.75 2.75 0 0 0-3.89 3.89l.53.53 3.89 3.89 3.89-3.89.53-.53a2.748 2.748 0 0 0 0-3.89v0Z"
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M14 14h12v12H14z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
