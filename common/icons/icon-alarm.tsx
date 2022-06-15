import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const IconAlarm = (props: SvgProps) => (
  <Svg width={16} height={17} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.253 2.807 4.4 1.787 1.333 4.354l.86 1.02 3.06-2.567Zm9.414 1.553L11.6 1.787l-.86 1.02 3.067 2.573.86-1.02ZM7.333 5.88h1v3.5L11 10.96l-.5.82-3.167-1.9v-4ZM8 3.214a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm-4.667 6A4.663 4.663 0 0 0 8 13.88a4.663 4.663 0 0 0 4.667-4.666A4.663 4.663 0 0 0 8 4.547a4.663 4.663 0 0 0-4.667 4.667Z"
      fill="#000"
    />
  </Svg>
);
