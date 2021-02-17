import { Complement, WithId } from 'appjusto-types';
import React from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import { QuantityButton } from '../../../../../common/components/buttons/QuantityButton';
import { useProductComplementImageURI } from '../../../../../common/store/api/business/hooks/useProductComplementImageURI';
import { useContextBusinessId } from '../../../../../common/store/context/business';
import { colors, padding, texts } from '../../../../../common/styles';
import { formatCurrency } from '../../../../../common/utils/formatters';
import { ListItemImage } from '../../components/ListItemImage';

interface Props {
  complement: WithId<Complement>;
  selected: boolean;
  disabled: boolean;
  onToggle: (selected: boolean) => void;
}

export const ProductComplementListItem = ({ complement, selected, disabled, onToggle }: Props) => {
  // context
  const businessId = useContextBusinessId();
  // state
  const { data: imageURI } = useProductComplementImageURI(businessId, complement.id);
  // UI
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (!disabled) onToggle(!selected);
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: padding,
          paddingVertical: 12,
          // alignContent: 'center',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderColor: colors.grey50,
        }}
      >
        <View>
          <QuantityButton
            sign={selected ? 'minus' : 'plus'}
            size="small"
            selected={selected}
            disabled={disabled}
          />
        </View>
        <View style={{ flex: 1, paddingHorizontal: padding }}>
          <Text style={{ ...texts.sm }}>{complement.name}</Text>
          <Text
            style={{ ...texts.sm, color: colors.grey700, marginTop: 4, flexWrap: 'wrap' }}
            numberOfLines={2}
          >
            {complement.description}
          </Text>
          <Text style={{ ...texts.sm, marginTop: 4 }}>{formatCurrency(complement.price)}</Text>
        </View>
        <View>
          <ListItemImage uri={imageURI} size={96} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
