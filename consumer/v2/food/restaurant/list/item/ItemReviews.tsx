import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { BusinessAlgolia } from '../../../../../../../types';
import { colors, texts } from '../../../../../../common/styles';
import { ItemBullet } from './ItemBullet';

interface Props {
  business: BusinessAlgolia;
}

export const ItemReviews = ({ business }: Props) => {
  if (!business) return null;
  const positive = business?.reviews?.positiveReviews ?? 0;
  const negative = business?.reviews?.negativeReviews ?? 0;
  const isNew = positive + negative < 5;
  if (isNew) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ItemBullet />
        <Text style={{ marginLeft: 2, ...texts.ss, color: colors.mellowYellow, borderWidth: 0 }}>
          Novidade!
        </Text>
      </View>
    );
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <ItemBullet />
      <MaterialIcons name="thumb-up-off-alt" color={colors.green600} size={18} />
      <Text style={{ marginLeft: 2, ...texts.xs, color: colors.green600 }}>{positive}</Text>
      <MaterialIcons
        name="thumb-down-off-alt"
        color={colors.grey700}
        size={18}
        style={{ marginLeft: 4 }}
      />
      <Text style={{ marginLeft: 2, ...texts.xs, color: colors.grey700 }}>{negative}</Text>
    </View>
  );
};
