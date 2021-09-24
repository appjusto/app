import React from 'react';
import { Image, View } from 'react-native';

interface Props {
  uri: string | undefined | null;
  height: number;
  width: number;
}

export const ListItemImage = ({ uri, height, width }: Props) => {
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
          borderRadius={8}
          resizeMode="cover"
        />
      )}
    </View>
  );
};
