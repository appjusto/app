import React from 'react';
import { View } from 'react-native';
import { colors } from '../../../../../../common/styles';

export const ItemBullet = () => {
  return (
    <View
      style={{
        width: 6,
        height: 6,
        backgroundColor: colors.grey10,
        borderRadius: 32,
        marginHorizontal: 6,
        borderWidth: 0,
        top: 1,
      }}
    />
  );
};
