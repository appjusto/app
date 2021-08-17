import { Complement, ComplementGroup, Product, WithId } from '@appjusto/types';
import React from 'react';
import { View } from 'react-native';
import SingleHeader from '../../../../../common/components/texts/SingleHeader';
import { halfPadding, padding } from '../../../../../common/styles';
import { ItemComplementRequiredLabel } from './ItemComplementRequiredLabel';
import { ProductComplementListItem } from './ProductComplementListItem';

interface Props {
  product: WithId<Product>;
  getTotalComplements: () => number;
  getComplementQuantity: (complementId: string) => number;
  canAddComplement: (group: WithId<ComplementGroup>) => boolean;
  onComplementToggle: (
    group: WithId<ComplementGroup>,
    complement: WithId<Complement>,
    selected: boolean
  ) => void;
  onComplementIncrement: (complementId: string) => void;
  onComplementDecrement: (complementId: string) => void;
}

export const ItemComplements = ({
  product,
  getTotalComplements,
  getComplementQuantity,
  canAddComplement,
  onComplementToggle,
  onComplementIncrement,
  onComplementDecrement,
}: Props) => {
  // UI
  if (!product.complementsEnabled) return null;
  return (
    <View>
      {product.complementsGroups?.map((group) => (
        <View key={group.id}>
          <SingleHeader title={group.name} />
          <ItemComplementRequiredLabel
            style={{ marginLeft: padding, marginBottom: halfPadding }}
            group={group}
            totalSelected={getTotalComplements()}
          />
          {group.items?.map((complement) => {
            return (
              <ProductComplementListItem
                key={complement.id}
                group={group}
                complement={complement}
                getComplementQuantity={getComplementQuantity}
                canAddComplement={(group) => canAddComplement(group)}
                onToggle={(selected) => onComplementToggle(group, complement, selected)}
                onIncrement={() => onComplementIncrement(complement.id)}
                onDecrement={() => onComplementDecrement(complement.id)}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};
