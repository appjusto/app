import * as React from 'react';
import Svg, { Mask, Path, SvgProps } from 'react-native-svg';

export const IconMapOrigin = (props: SvgProps) => {
  return (
    <Svg width={32} height={41} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path
        opacity={0.15}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.54 37.409C29.46 36.862 32 35.987 32 35c0-1.657-7.163-3-16-3S0 33.343 0 35c0 1.063 2.948 1.997 7.394 2.53L5 38l11.775 2.313L28.55 38l-3.01-.591z"
        fill="#000"
      />
      <Mask id="prefix__a" fill="#fff">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M25.52 29.763C29.45 26.757 32 21.935 32 16.5 32 7.387 24.837 0 16 0S0 7.387 0 16.5c0 5.764 2.865 10.837 7.207 13.787l8.903 9.226 9.41-9.75z"
        />
      </Mask>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.52 29.763C29.45 26.757 32 21.935 32 16.5 32 7.387 24.837 0 16 0S0 7.387 0 16.5c0 5.764 2.865 10.837 7.207 13.787l8.903 9.226 9.41-9.75z"
        fill="#000"
      />
      <Path
        d="M25.52 29.763l-.608-.794-.06.046-.052.054.72.694zm-18.313.524l.72-.694-.072-.075-.086-.058-.562.827zm8.903 9.226l-.72.695.72.745.72-.745-.72-.695zM31 16.5c0 5.118-2.399 9.648-6.088 12.469l1.215 1.589C30.3 27.366 33 22.253 33 16.5h-2zM16 1c8.256 0 15 6.91 15 15.5h2C33 6.864 25.418-1 16-1v2zM1 16.5C1 7.91 7.745 1 16 1v-2C6.582-1-1 6.864-1 16.5h2zm6.77 12.96C3.696 26.693 1 21.927 1 16.5h-2c0 6.1 3.034 11.48 7.645 14.614L7.77 29.46zm9.06 9.359l-8.903-9.226-1.44 1.389 8.904 9.226 1.439-1.389zm7.97-9.75l-9.41 9.75 1.44 1.389 9.409-9.75-1.44-1.39z"
        fill="#fff"
        mask="url(#prefix__a)"
      />
      <Path
        d="M19.75 14.833l-7.5-4.325m11.25 9.825v-6.666a1.667 1.667 0 00-.833-1.442l-5.834-3.333a1.666 1.666 0 00-1.666 0l-5.834 3.333a1.667 1.667 0 00-.833 1.442v6.666a1.667 1.667 0 00.833 1.442l5.834 3.333a1.666 1.666 0 001.666 0l5.834-3.333a1.667 1.667 0 00.833-1.442z"
        stroke="#78E08F"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.725 12.8L16 17.008l7.275-4.208M16 25.4V17"
        stroke="#78E08F"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
