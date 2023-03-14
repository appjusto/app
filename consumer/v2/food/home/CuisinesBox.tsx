import { Cuisine } from '@appjusto/types';
import React from 'react';
import { Text, View } from 'react-native';
import RoundedText from '../../../../common/components/texts/RoundedText';
import { useCuisineImageURI } from '../../../../common/store/api/platform/hooks/useCuisineImageURI';
import { colors, halfPadding, texts } from '../../../../common/styles';
import { borderRadius2 } from '../../../v3/common/styles/borders';
import { ListItemImage } from '../common/ListItemImage';

type Props = {
  cuisine: Cuisine;
  selected?: boolean;
};

export default function ({ cuisine, selected }: Props) {
  const { data: imageURI } = useCuisineImageURI(cuisine.imagePath);
  return (
    <View
      style={{
        height: 154,
        width: 120,
        marginRight: halfPadding,
        alignItems: 'center',
      }}
    >
      <ListItemImage uri={imageURI} height={120} width={120} radius={borderRadius2} />
      <View style={{ paddingTop: 4 }}>
        {selected ? (
          <RoundedText backgroundColor={selected ? colors.green500 : colors.grey50} noBorder>
            {cuisine.name}
          </RoundedText>
        ) : (
          <Text style={{ ...texts.xs }}>{cuisine.name}</Text>
        )}
      </View>
    </View>
  );
}
