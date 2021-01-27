import { Product, WithId } from 'appjusto-types';
import React from 'react';
import { View } from 'react-native';
import SingleHeader from '../../SingleHeader';
import { ProductComplementListItem } from '../detail/ProductComplementListItem';

interface Props {
  product: WithId<Product>;
}

export const ItemComplements = ({ product }: Props) => {
  if (!product.complementsEnabled) return null;
  return (
    <View>
      {product.complementsGroups?.map((group) => (
        <View key={group.id}>
          <SingleHeader title={group.name} />
          {group.items?.map((complement) => (
            <ProductComplementListItem key={complement.id} complement={complement} />
          ))}
        </View>
      ))}
    </View>
  );
};
