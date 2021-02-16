import React from 'react';
import { Image, View } from 'react-native';
import { borders, colors } from '../../../../common/styles';

interface Props {
  uri: string | undefined | null;
  size?: number;
}

export const ListItemImage = ({ uri, size = 80 }: Props) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: colors.grey50,
        ...borders.default,
        borderColor: colors.white,
      }}
    >
      {uri && (
        <Image
          source={{
            uri,
          }}
          style={{ width: size, height: size }}
        />
      )}
    </View>
  );
};
