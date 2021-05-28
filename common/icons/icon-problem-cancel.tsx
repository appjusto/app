import * as React from 'react';
import Svg, { Circle, Path, SvgProps } from 'react-native-svg';

export const IconProblemCancel = (props: SvgProps) => {
  return (
    <Svg width={64} height={64} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Circle cx={32} cy={32} r={32} fill="#F6F6F6" />
      <Circle cx={32} cy={36} r={15} fill="#FFE493" />
      <Path
        d="M32 16c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16c-.01-8.832-7.168-15.99-16-16zm0 30.968c-8.267 0-14.968-6.702-14.968-14.968 0-8.267 6.701-14.968 14.968-14.968S46.968 23.733 46.968 32c-.01 8.263-6.705 14.959-14.968 14.968z"
        fill="#000"
      />
      <Path
        d="M39.299 24.7a.516.516 0 00-.73 0L32 31.27l-6.57-6.57a.516.516 0 10-.73.73L31.27 32l-6.57 6.57a.516.516 0 10.73.729l6.57-6.57 6.57 6.57a.516.516 0 00.729-.73L32.729 32l6.57-6.568a.516.516 0 000-.73z"
        fill="#000"
      />
    </Svg>
  );
};
