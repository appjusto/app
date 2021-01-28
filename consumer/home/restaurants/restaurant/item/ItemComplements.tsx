import { Complement, Product, WithId } from 'appjusto-types';
import React from 'react';
import { View } from 'react-native';
import HR from '../../../../../common/components/views/HR';
import SingleHeader from '../../SingleHeader';
import { ProductComplementListItem } from '../detail/ProductComplementListItem';

interface Props {
  product: WithId<Product>;
  selectedComplements: WithId<Complement>[];
  onComplementToggle: (complement: WithId<Complement>, selected: boolean) => void;
}

export const ItemComplements = ({ product, selectedComplements, onComplementToggle }: Props) => {
  if (!product.complementsEnabled) return null;
  return (
    <View>
      {product.complementsGroups?.map((group) => (
        <View key={group.id}>
          <SingleHeader title={group.name} />
          <HR />
          {group.items?.map((complement) => (
            <ProductComplementListItem
              key={complement.id}
              complement={complement}
              selected={Boolean(selectedComplements.find((c) => c.id === complement.id))}
              onToggle={(selected) => onComplementToggle(complement, selected)}
            />
          ))}
        </View>
      ))}
    </View>
  );
};
