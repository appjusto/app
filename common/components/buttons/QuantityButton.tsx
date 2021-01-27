import React from 'react';
import { Image, View } from 'react-native';
import * as icons from '../../../assets/icons';
import { borders, colors } from '../../styles';

interface Props {
  sign: 'plus' | 'minus';
  size?: 'small' | 'big';
  selected?: boolean;
}

export const QuantityButton = ({ sign, size = 'small', selected = false }: Props) => {
  const dimension = size === 'small' ? 24 : 48;
  const border = size === 'small' ? borders.squared : borders.default;
  return (
    <View
      style={{
        ...border,
        width: dimension,
        height: dimension,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: selected ? colors.green : colors.white,
        borderColor: colors.black,
      }}
    >
      <Image
        source={sign === 'plus' ? icons.plus : icons.minus}
        width={dimension / 2}
        height={dimension / 2}
      />
    </View>
  );
};
