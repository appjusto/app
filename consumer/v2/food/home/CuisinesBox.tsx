import { Cuisine } from '@appjusto/types';
import React from 'react';
import { View } from 'react-native';
import RoundedText from '../../../../common/components/texts/RoundedText';
import { useCuisineImageURI } from '../../../../common/store/api/platform/hooks/useCuisineImageURI';
import { colors, halfPadding } from '../../../../common/styles';
import { t } from '../../../../strings';
import { ListItemImage } from '../common/ListItemImage';

type Props = {
  cuisine: Cuisine;
  selected?: boolean;
};

export default function ({ cuisine, selected }: Props) {
  const { data: imageURI } = useCuisineImageURI(cuisine.imagePath);
  return (
    <View style={{ height: 96, width: 96, borderRadius: 8, marginRight: halfPadding }}>
      <ListItemImage uri={imageURI} height={96} width={96} />
      <View style={{ position: 'absolute', left: 4, bottom: 4 }}>
        <RoundedText backgroundColor={selected ? colors.green500 : colors.white}>
          {t(cuisine.name)}
        </RoundedText>
      </View>
    </View>
  );
}
