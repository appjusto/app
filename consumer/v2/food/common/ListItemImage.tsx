import React from 'react';
import { Image, View } from 'react-native';
import { borders, colors } from '../../../../common/styles';

interface Props {
  uri: string | undefined | null;
  height: number;
  width: number;
  radius?: number;
}

export const ListItemImage = ({ uri, height, width, radius = 8 }: Props) => {
  return (
    <View
      style={{
        width,
        height,
        backgroundColor: colors.grey50,
        ...borders.default,
        borderColor: colors.white,
        overflow: 'hidden',
      }}
    >
      {uri && (
        <Image
          source={{
            uri,
          }}
          style={{ width, height }}
          borderRadius={radius}
          resizeMode="cover"
        />
      )}
    </View>
  );
};
