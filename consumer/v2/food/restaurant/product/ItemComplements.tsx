import { Complement, ComplementGroup, Product, WithId } from 'appjusto-types';
import React from 'react';
import { View } from 'react-native';
import SingleHeader from '../../../../../common/components/texts/SingleHeader';
import HR from '../../../../../common/components/views/HR';
import * as helpers from '../../../../../common/store/api/order/helpers';
import { halfPadding, padding } from '../../../../../common/styles';
import { ItemComplementRequiredLabel } from './ItemComplementRequiredLabel';
import { ProductComplementListItem } from './ProductComplementListItem';

interface Props {
  product: WithId<Product>;
  selectedComplements: WithId<Complement>[];
  onComplementToggle: (
    group: WithId<ComplementGroup>,
    complement: WithId<Complement>,
    selected: boolean
  ) => void;
}

export const ItemComplements = ({ product, selectedComplements, onComplementToggle }: Props) => {
  if (!product.complementsEnabled) return null;
  return (
    <View>
      {product.complementsGroups?.map((group) => (
        <View key={group.id}>
          <SingleHeader title={group.name} />
          <ItemComplementRequiredLabel
            style={{ marginLeft: padding }}
            group={group}
            totalSelected={helpers.totalComplementsInGroup(group, selectedComplements)}
          />
          <HR style={{ marginTop: halfPadding }} />
          {group.items?.map((complement) => {
            const selected = Boolean(selectedComplements.find((c) => c.id === complement.id));
            return (
              <ProductComplementListItem
                key={complement.id}
                complement={complement}
                selected={selected}
                disabled={!selected && !helpers.canAddComplement(group, selectedComplements)}
                onToggle={(selected) => onComplementToggle(group, complement, selected)}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};
