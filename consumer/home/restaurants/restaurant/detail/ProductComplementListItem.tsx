import { Complement } from 'appjusto-types';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { QuantityButton } from '../../../../../common/components/buttons/QuantityButton';
import { borders, colors, padding, texts } from '../../../../../common/styles';
import { formatCurrency } from '../../../../../common/utils/formatters';
import * as fake from '../../fakeData';

interface Props {
  complement: Complement;
}

export const ProductComplementListItem = ({ complement }: Props) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: padding,
        paddingVertical: 12,
        // alignContent: 'center',
        alignItems: 'center',
        ...borders.default,
      }}
    >
      <View>
        <QuantityButton sign="plus" size="small" selected />
      </View>
      <View style={{ flex: 1, paddingHorizontal: padding }}>
        <Text style={{ ...texts.default }}>{complement.name}</Text>
        <Text
          style={{ ...texts.default, color: colors.darkGrey, marginTop: 4, flexWrap: 'wrap' }}
          numberOfLines={2}
        >
          {complement.description}
        </Text>
        <Text style={{ ...texts.default, marginTop: 4 }}>{formatCurrency(complement.price)}</Text>
      </View>
      <View>
        <Image
          source={complement.imageExists ? fake.itemRectangle : fake.itemRectangle}
          style={{ height: 96, width: 96, borderRadius: 8 }}
        />
      </View>
    </View>
  );
};
