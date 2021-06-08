import * as React from 'react';
import Svg, { Circle, Path, SvgProps } from 'react-native-svg';

export const IconProblemUrgent = (props: SvgProps) => {
  return (
    <Svg width={64} height={64} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Circle cx={32} cy={32} r={32} fill="#DC3545" />
      <Path
        d="M30.317 36.742c-.495 0-.743-.243-.743-.73l-.525-18.282c0-.487.233-.73.7-.73h4.677c.466 0 .7.243.7.73l-.569 18.283c0 .486-.262.73-.787.73h-3.453zM31.978 47c-1.137 0-2.084-.358-2.841-1.073-.758-.744-1.137-1.63-1.137-2.66 0-1.002.393-1.86 1.18-2.576.816-.744 1.749-1.116 2.798-1.116 1.05 0 1.982.372 2.798 1.116.816.715 1.224 1.574 1.224 2.575 0 1.03-.393 1.917-1.18 2.661-.758.715-1.705 1.073-2.842 1.073z"
        fill="#fff"
      />
    </Svg>
  );
};
