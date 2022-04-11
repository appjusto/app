import * as React from 'react';
import Svg, { Path, Rect, SvgProps } from 'react-native-svg';

export const MasterCardIcon = ({ width = 40, height = 25, ...props }: SvgProps) => {
  return (
    <Svg width={width} height={height} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Rect
        x={0.271}
        y={0.271}
        width={39.452}
        height={23.954}
        rx={3.729}
        fill="#fff"
        stroke="#D9D9D9"
        strokeWidth={0.542}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.23 17.857a7.313 7.313 0 0 1-4.796 1.786c-4.083 0-7.392-3.348-7.392-7.478s3.31-7.478 7.392-7.478c1.83 0 3.504.672 4.795 1.786a7.314 7.314 0 0 1 4.795-1.786c4.083 0 7.393 3.348 7.393 7.478s-3.31 7.478-7.393 7.478a7.313 7.313 0 0 1-4.795-1.786Z"
        fill="#ED0006"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.229 17.857a7.497 7.497 0 0 0 2.597-5.692c0-2.28-1.008-4.32-2.597-5.692a7.314 7.314 0 0 1 4.795-1.786c4.083 0 7.392 3.348 7.392 7.478s-3.31 7.478-7.392 7.478a7.313 7.313 0 0 1-4.795-1.786Z"
        fill="#F9A000"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.23 17.857a7.497 7.497 0 0 0 2.596-5.692 7.497 7.497 0 0 0-2.597-5.692 7.497 7.497 0 0 0-2.597 5.692 7.5 7.5 0 0 0 2.597 5.692Z"
        fill="#FF5E00"
      />
    </Svg>
  );
};
