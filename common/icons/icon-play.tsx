import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const IconPlay = (props: SvgProps) => {
  return (
    <Svg width={54} height={54} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M.334 27C.334 12.28 12.281.333 27.001.333 41.72.333 53.667 12.28 53.667 27c0 14.72-11.946 26.666-26.666 26.666S.334 41.72.334 27zm37.332 0l-16-12v24l16-12z"
        fill="#000"
      />
    </Svg>
  );
};
