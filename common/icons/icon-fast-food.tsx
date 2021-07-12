import * as React from 'react';
import { View } from 'react-native';
import Svg, { Path, SvgProps } from 'react-native-svg';
import { colors } from '../styles';

export const IconFastFood = (props: SvgProps) => {
  return (
    <View
      style={{
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Svg width={22} height={22} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17 0v4h5l-1.65 16.53c-.1.82-.79 1.47-1.63 1.47H17v-2h1.39l1.4-14h-9.56L10 4h5V0h2zM7.5 7.99C3.75 7.99 0 10 0 14h15c0-4-3.75-6.01-7.5-6.01zM0 20.98c0 .56.45 1.01 1.01 1.01H14c.56 0 1.01-.45 1.01-1.01V20H0v.98zM7.5 9.99c-1.41 0-3.77.46-4.88 2.01h9.76c-1.11-1.55-3.47-2.01-4.88-2.01zM15 16v2H0v-2h15z"
          fill="#000"
        />
      </Svg>
    </View>
  );
};
