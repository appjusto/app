import React from 'react';
import { Image, View } from 'react-native';

interface Props {
  uri: string | undefined | null;
  height: number;
  width: number;
  borderRadius?: number;
}

export const ListItemImage = ({ uri, height, width, borderRadius = 8 }: Props) => {
  return (
    <View
      style={{
        width,
        height,
        overflow: 'hidden',
      }}
    >
      {uri && (
        <Image
          source={{
            uri,
          }}
          style={{ width, height }}
          borderRadius={borderRadius}
          resizeMode="cover"
        />
      )}
    </View>
  );
};
