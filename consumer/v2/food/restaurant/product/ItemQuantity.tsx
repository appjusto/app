import React from 'react';
import { Text, TouchableOpacity, View, ViewProps } from 'react-native';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import { QuantityButton } from '../../../../../common/components/buttons/QuantityButton';
import { halfPadding, padding } from '../../../../../common/styles';

interface Props extends ViewProps {
  value: number;
  title: string;
  disabled: boolean;
  minimum?: number;
  onChange: (value: number) => void;
  onSubmit: () => void;
}

export const ItemQuantity = ({
  value,
  title,
  disabled,
  minimum = 1,
  style,
  onChange,
  onSubmit,
}: Props) => {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <TouchableOpacity
          onPress={() => {
            if (value - 1 >= minimum) onChange(value - 1);
          }}
        >
          <QuantityButton sign="minus" size="big" />
        </TouchableOpacity>
        <Text style={{ marginHorizontal: padding }}>{value}</Text>
        <TouchableOpacity onPress={() => onChange(value + 1)}>
          <QuantityButton sign="plus" size="big" />
        </TouchableOpacity>
      </View>
      <View style={{ marginLeft: padding, flex: 1 }}>
        <DefaultButton
          disabled={disabled}
          title={title}
          onPress={onSubmit}
          style={{ paddingHorizontal: halfPadding }}
        />
      </View>
    </View>
  );
};
