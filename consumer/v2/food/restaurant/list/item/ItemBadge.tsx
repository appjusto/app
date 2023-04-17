import { BusinessAlgolia } from '@appjusto/types';
import React from 'react';
import { Text, View } from 'react-native';
import { colors, texts } from '../../../../../../common/styles';
import { AppJustoOnlyIcon } from '../../../../../v3/food/home/header/carousel/icons/AppJustoOnlyIcon';

interface Props {
  business: BusinessAlgolia;
}

export const ItemBadge = ({ business }: Props) => {
  const averageDiscount =
    business.averageDiscount && !isNaN(business.averageDiscount) ? business.averageDiscount : 0;
  const appjustoOnly = business.tags?.includes('appjusto-only');
  if (!averageDiscount && !appjustoOnly) return null;
  if (appjustoOnly) {
    return (
      <View>
        <AppJustoOnlyIcon
          style={{ transform: [{ scale: 0.65 }], position: 'absolute', top: -10, borderWidth: 0 }}
        />
      </View>
    );
  }
  return (
    <View style={{ top: -3, left: 8, borderWidth: 0 }}>
      <View style={{ position: 'absolute', flexDirection: 'row', borderWidth: 0 }}>
        <View
          style={{
            width: 26,
            height: 26,
            backgroundColor: colors.green500,
            borderRadius: 32,
            position: 'absolute',
            borderWidth: 0,
          }}
        />
        <Text
          style={{
            ...texts.x2s,
            fontSize: 10,
            ...texts.bold,
            // position: 'absolute',
            // alignSelf: 'center',
            top: 7,
            left: averageDiscount < 10 ? 7 : 5,
            // flex: 1,
            borderWidth: 0,
          }}
        >{`${averageDiscount}%`}</Text>
      </View>
    </View>
  );
};
