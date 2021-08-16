import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { QuantityButton } from '../../../../../common/components/buttons/QuantityButton';
import { halfPadding, texts } from '../../../../../common/styles';

type Props = {
  onIncrement: () => void;
  onDecrement: () => void;
  quantity: number;
  selected: boolean;
};

export const ComplementQuantity = ({ onIncrement, onDecrement, quantity, selected }: Props) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity style={{ paddingRight: halfPadding }} onPress={onIncrement}>
        <QuantityButton sign="minus" selected={selected} />
      </TouchableOpacity>
      <Text style={{ ...texts.md }}>{quantity}</Text>
      <TouchableOpacity style={{ paddingLeft: halfPadding }} onPress={onDecrement}>
        <QuantityButton sign="plus" selected={selected} />
      </TouchableOpacity>
    </View>
  );
};
