import { Complement, ComplementGroup, WithId } from '@appjusto/types';
import React from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import { QuantityButton } from '../../../../../common/components/buttons/QuantityButton';
import { useProductComplementImageURI } from '../../../../../common/store/api/business/hooks/useProductComplementImageURI';
import { useContextBusinessId } from '../../../../../common/store/context/business';
import { colors, halfPadding, padding, texts } from '../../../../../common/styles';
import { formatCurrency } from '../../../../../common/utils/formatters';
import { ListItemImage } from '../../common/ListItemImage';
import { ComplementQuantity } from './ComplementQuantity';

interface Props {
  group: WithId<ComplementGroup>;
  complement: WithId<Complement>;
  getComplementQuantity: (complementId: string) => number;
  canAddComplement: (group: WithId<ComplementGroup>) => boolean;
  onToggle: (selected: boolean) => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const ProductComplementListItem = ({
  group,
  complement,
  getComplementQuantity,
  canAddComplement,
  onToggle,
  onIncrement,
  onDecrement,
}: Props) => {
  // context
  const businessId = useContextBusinessId();
  // state
  const { data: imageURI } = useProductComplementImageURI(businessId, complement.id);
  // UI
  const maximum = complement.maximum ?? 1;
  const quantity = getComplementQuantity(complement.id);
  const canAdd = quantity < maximum && canAddComplement(group);
  const selected = quantity > 0;
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (maximum > 1) return;
        if (selected || canAdd) onToggle(!selected);
      }}
    >
      <View style={{ paddingHorizontal: padding, paddingBottom: 12 }}>
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 12,
            paddingBottom: 4,
            alignItems: 'center',
            borderTopWidth: 1,
            borderStyle: 'solid',
            borderColor: colors.grey50,
          }}
        >
          {maximum === 1 ? (
            <View style={{ marginRight: padding }}>
              <QuantityButton
                sign={selected ? 'minus' : 'plus'}
                size="small"
                selected={selected}
                disabled={!canAdd}
              />
            </View>
          ) : null}
          <View style={{ flex: 1 }}>
            <Text style={{ ...texts.sm }}>{complement.name}</Text>
            {complement.description ? (
              <Text style={{ ...texts.sm, color: colors.grey700, marginTop: 4, flexWrap: 'wrap' }}>
                {complement.description}
              </Text>
            ) : null}
            <Text style={{ ...texts.sm, marginTop: 4 }}>{formatCurrency(complement.price)}</Text>
          </View>
          {imageURI ? (
            <View>
              <ListItemImage uri={imageURI} height={96} width={96} />
            </View>
          ) : null}
        </View>
        {maximum > 1 ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: halfPadding }}>
            <ComplementQuantity
              onIncrement={() => (quantity === 0 ? onToggle(true) : onIncrement())}
              onDecrement={onDecrement}
              quantity={quantity}
              incrementDisabled={!canAdd}
            />
          </View>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
};
