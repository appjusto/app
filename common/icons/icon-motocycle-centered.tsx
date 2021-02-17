import * as React from 'react';
import Svg, { Circle, Color, Path, SvgProps } from 'react-native-svg';
import { colors } from '../styles';

interface Props extends SvgProps {
  circleColor?: Color;
  flipped?: boolean;
}

export const IconMotocycleCentered = ({
  circleColor = colors.white,
  style,
  flipped = false,
  ...props
}: Props) => {
  const originalWidth = 64;
  const originalHeight = 64;
  const { width = originalWidth, height = originalHeight } = props;
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      style={[style, flipped ? { transform: [{ scaleX: -1 }] } : null]}
      viewBox={`0 0 ${originalWidth} ${originalHeight}`}
      width={width}
      height={height}
      {...props}
    >
      <Circle cx={32} cy={32} r={32} fill="#fff" />
      <Path transform="matrix(.7123 -.70187 .7123 .70187 17 41)" stroke="#000" d="M0-.5h3" />
      <Path transform="matrix(-.5201 -.85411 .86082 -.50892 46 40)" stroke="#000" d="M0-.5h3" />
      <Path
        transform="matrix(.89704 .44194 -.45251 .89176 49 34)"
        stroke="#000"
        strokeLinecap="round"
        d="M.5-.5h3"
      />
      <Path
        stroke="#000"
        d="M50.5 22v6m-7-6v6m9 14c0 3-2.648 5.5-6 5.5s-6-2.5-6-5.5 2.648-5.5 6-5.5 6 2.5 6 5.5zm-30 0c0 3-2.648 5.5-6 5.5s-6-2.5-6-5.5 2.648-5.5 6-5.5 6 2.5 6 5.5z"
      />
      <Circle cx={16.5} cy={41.5} r={1} stroke="#000" />
      <Path
        d="M37.239 43.097l-14.405.258-8.12-9.807c3.563-7.019 9.953-7.484 12.834-7.484-4.19 5.162-3.405 11.527-2.357 13.936h4.714l2.62-3.613-1.703-1.957c-.563-.647-.103-1.656.755-1.656h4.876l11-4.645c.21 2.684 1.659 3.527 2.357 3.613l-.524 1.806-12.047 9.549z"
        fill="#fff"
        stroke="#000"
      />
      <Path
        d="M37.927 42.855l3.409-2.613h5.095a1.306 1.306 0 010 2.613h-8.504zm-26.083-8.404c.9-.483 2.003-.742 2.87-.903l1.571 2.065h-3.982c-.78 0-1.146-.793-.459-1.162zm23.47-4.774h-1.75a3.4 3.4 0 00-3.033 1.862.85.85 0 00.758 1.235h5.163l11.262-4.903h-7.072l-4.645 1.686a2 2 0 01-.683.12zm-7.504-3.871H21c0-2.683 1.92-3.526 2.88-3.613h1.93a2 2 0 012 2v1.613z"
        stroke="#000"
      />
      <Path
        d="M51 27.871h-8.143a3 3 0 01-3-3V19a3 3 0 013-3H51a3 3 0 013 3v5.871a3 3 0 01-3 3z"
        fill="#FFE493"
        stroke="#000"
      />
      <Path
        stroke="#000"
        d="M40 21.5h14m-14.143-1.887H54m-29.596 6.193v-6.451m0 0v-.347a2.75 2.75 0 012.75-2.75v0c.507 0 .917.41.917.917v1.18a1 1 0 01-1 1h-2.667z"
      />
    </Svg>
  );
};
