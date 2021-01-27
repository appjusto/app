import { Product } from 'appjusto-types';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { colors, halfPadding, padding, texts } from '../../../../../common/styles';
import { formatCurrency } from '../../../../../common/utils/formatters';
import * as fake from '../../fakeData';

interface Props {
  product: Product;
}

export const ProductListItem = ({ product }: Props) => {
  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderStyle: 'solid',
        width: '100%',
        borderColor: colors.grey,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          paddingLeft: padding,
          paddingRight: halfPadding,
          marginVertical: halfPadding,
        }}
      >
        <View style={{ width: '60%' }}>
          <Text style={{ ...texts.default }}>{product.name}</Text>
          <Text
            style={{ ...texts.small, color: colors.darkGrey, marginVertical: 4 }}
            numberOfLines={2}
          >
            {product.description}
          </Text>
          <Text style={{ ...texts.default }}>{formatCurrency(product.price)}</Text>
        </View>
        <View>
          <Image
            source={product.imageExists ? fake.itemRectangle : fake.itemRectangle}
            style={{ height: 96, width: 96, borderRadius: 8 }}
          />
        </View>
      </View>
    </View>
  );
};
