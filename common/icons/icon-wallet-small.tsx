import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const IconWalletSmall = (props: SvgProps) => {
  return (
    <Svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path d="M2.5 5.417l11.667-3.333v11.25L2.5 16.666V5.417z" fill="#6CE787" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.876 1.169A1.667 1.667 0 0115 2.772v1.395h1.667c.92 0 1.667.746 1.667 1.666v10c0 .921-.747 1.667-1.667 1.667H3.334c-.92 0-1.667-.746-1.667-1.666h.022a1.666 1.666 0 01-.022-.272V5.629c0-.744.493-1.398 1.209-1.603l10-2.857zM8.45 15.834h8.217v-10H15V7.5h1.667v1.667H15v3.538c0 .744-.493 1.398-1.209 1.602l-5.34 1.527zM3.334 5.629v9.933l10-2.857V2.772l-10 2.857zM11.667 7.5A.833.833 0 1110 7.5a.833.833 0 011.667 0z"
        fill="#000"
      />
    </Svg>
  );
};
