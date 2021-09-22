import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { QuantityButton } from '../../../../../common/components/buttons/QuantityButton';
import { padding, texts } from '../../../../../common/styles';

type Props = {
  onIncrement: () => void;
  onDecrement: () => void;
  quantity: number;
  incrementDisabled?: boolean;
};

export const ComplementQuantity = ({
  onIncrement,
  onDecrement,
  quantity,
  incrementDisabled,
}: Props) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity style={{ paddingRight: padding }} onPress={onDecrement}>
        <QuantityButton sign="minus" disabled={quantity === 0} />
      </TouchableOpacity>
      <Text style={{ ...texts.md }}>{quantity}</Text>
      <TouchableOpacity
        style={{ paddingLeft: padding }}
        onPress={() => {
          console.log('onIncrement');
          if (!incrementDisabled) onIncrement();
        }}
      >
        <QuantityButton sign="plus" selected={quantity > 0} disabled={incrementDisabled} />
      </TouchableOpacity>
    </View>
  );
};
