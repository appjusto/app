import React from 'react';
import { View, Image } from 'react-native';

import * as icons from '../../../assets/icons';
import { colors } from '../../styles';

type Props = {
  icon: any;
  size?: number;
};

export default function RoundedIcon({ icon, size = 40 }: Props) {
  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.green,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: colors.black,
        borderRadius: size / 2,
      }}
    >
      <Image source={icon} />
    </View>
  );
}

export const ProfileIcon = () => <RoundedIcon icon={icons.user} />;
