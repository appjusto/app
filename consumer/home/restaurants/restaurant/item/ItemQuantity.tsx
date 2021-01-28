import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import { QuantityButton } from '../../../../../common/components/buttons/QuantityButton';
import { halfPadding, padding } from '../../../../../common/styles';

interface Props {
  value: number;
  title: string;
  onChange: (value: number) => void;
  onSubmit: () => void;
}

export const ItemQuantity = ({ value, title, onChange, onSubmit }: Props) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: halfPadding,
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={() => onChange(value - 1)}>
          <QuantityButton sign="minus" size="big" />
        </TouchableOpacity>
        <Text style={{ marginHorizontal: padding }}>{value}</Text>
        <TouchableOpacity onPress={() => onChange(value + 1)}>
          <QuantityButton sign="plus" size="big" />
        </TouchableOpacity>
      </View>
      <View style={{ marginLeft: padding }}>
        <DefaultButton title={title} onPress={onSubmit} />
      </View>
    </View>
  );
};
