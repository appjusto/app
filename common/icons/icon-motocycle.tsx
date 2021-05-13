import * as React from 'react';
import Svg, { Circle, Color, Path, SvgProps } from 'react-native-svg';
import useTallerDevice from '../hooks/useTallerDevice';
import { colors } from '../styles';

interface Props extends SvgProps {
  circleColor?: Color;
  flipped?: boolean;
}

export const IconMotocycle = ({
  circleColor = colors.green500,
  style,
  flipped = false,
  ...props
}: Props) => {
  const originalWidth = 115;
  const originalHeight = 114;
  const { width = originalWidth, height = originalHeight } = props;
  const tallerDevice = useTallerDevice();
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      style={[style, flipped ? { transform: [{ scaleX: -1 }] } : null]}
      viewBox={`0 0 ${originalWidth} ${originalHeight}`}
      width={tallerDevice ? width : 99}
      height={tallerDevice ? height : 98}
      {...props}
    >
      <Circle cx={57} cy={57} r={57} fill={circleColor} />
      <Circle cx={98.5} cy={86.5} r={11.75} stroke="#000" strokeWidth={1.5} />
      <Circle cx={40.5} cy={86.5} r={11.75} stroke="#000" strokeWidth={1.5} />
      <Circle cx={40} cy={86} r={2.25} stroke="#000" strokeWidth={1.5} />
      <Path
        d="M81.238 88.56l-28.155.511L37.214 69.62c6.962-13.924 19.453-14.845 25.084-14.845-8.19 10.238-6.655 22.865-4.607 27.643h9.214l5.119-7.167-4.728-5.516a1 1 0 01.76-1.65h11.647l21.499-9.215c.41 5.324 3.243 6.996 4.608 7.167l-1.024 3.583-23.548 18.94z"
        fill="#fff"
        stroke="#000"
        strokeWidth={1.5}
      />
      <Path
        d="M81.888 88.322l7.286-5.667h9.98a2.833 2.833 0 110 5.666H81.889zm-51.716-15.94c1.876-1.608 4.846-2.351 7.042-2.763l3.072 4.095H30.79c-.777 0-1.209-.826-.618-1.332zm38.698-8.23l-1.242 2.484a1 1 0 00.895 1.447h11.18l22.011-9.726H87.893l-9.392 3.46a2.002 2.002 0 01-.691.123h-5.362a4 4 0 00-3.577 2.212zm-6.06-9.89H49.5c0-5.324 3.754-6.996 5.631-7.167h5.678a2 2 0 012 2v5.167z"
        stroke="#000"
        strokeWidth={1.5}
      />
      <Path
        d="M111 58.357H89.357a3 3 0 01-3-3V37.81a3 3 0 013-3H111a3 3 0 013 3v17.547a3 3 0 01-3 3z"
        fill="#FFE493"
        stroke="#000"
        strokeWidth={1.5}
      />
      <Path
        stroke="#000"
        strokeWidth={1.5}
        d="M86 46.25h28m-27.643-4.274H114M56.155 54.262V41.464m0 0v-3.143a3 3 0 013-3h3.166a1 1 0 011 1v4.143a1 1 0 01-1 1h-6.166zM41.47 84.47l4.242-4.243m52.645 2.159l-3.087-5.145"
      />
      <Path stroke="#000" strokeWidth={1.5} strokeLinecap="round" d="M106.006 69.665l4.92 2.459" />
      <Path stroke="#000" strokeWidth={1.5} d="M107.75 46v12m-14-12v12" />
    </Svg>
  );
};
