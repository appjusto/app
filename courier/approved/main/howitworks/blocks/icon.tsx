import * as React from 'react';
import Svg, { Circle, Path, SvgProps } from 'react-native-svg';

export const IconBlocks = (props: SvgProps) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={64} height={64} fill="none" {...props}>
      <Circle cx={32} cy={32} r={32} fill="#F6F6F6" />
      <Path
        fill="#FFE493"
        d="M36.9 24h-5.8c-.68 0-1.64.4-2.12.88l-4.1 4.1c-.48.48-.88 1.44-.88 2.12v5.8c0 .68.4 1.64.88 2.12l4.1 4.1c.48.48 1.44.88 2.12.88h5.8c.68 0 1.64-.4 2.12-.88l4.1-4.1c.48-.48.88-1.44.88-2.12v-5.8c0-.68-.4-1.64-.88-2.12l-4.1-4.1c-.48-.48-1.44-.88-2.12-.88Z"
      />
      <Path
        stroke="#292D32"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M34.9 22h-5.8c-.68 0-1.64.4-2.12.88l-4.1 4.1c-.48.48-.88 1.44-.88 2.12v5.8c0 .68.4 1.64.88 2.12l4.1 4.1c.48.48 1.44.88 2.12.88h5.8c.68 0 1.64-.4 2.12-.88l4.1-4.1c.48-.48.88-1.44.88-2.12v-5.8c0-.68-.4-1.64-.88-2.12l-4.1-4.1c-.48-.48-1.44-.88-2.12-.88ZM28.5 35.5l7-7M35.5 35.5l-7-7"
      />
    </Svg>
  );
};
