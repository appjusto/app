import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import { QuantityButton } from '../../../../../common/components/buttons/QuantityButton';
import { halfPadding, padding } from '../../../../../common/styles';
import { t } from '../../../../../strings';

interface Props {
  onChange: (value: number) => void;
  getPrice: (value: number) => string;
}

export const ItemQuantity = ({ getPrice, onChange }: Props) => {
  const [value, setValue] = React.useState(1);

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
        <TouchableOpacity onPress={() => setValue(value - 1)}>
          <QuantityButton sign="minus" size="big" />
        </TouchableOpacity>
        <Text style={{ marginHorizontal: padding }}>{value}</Text>
        <TouchableOpacity onPress={() => setValue(value + 1)}>
          <QuantityButton sign="plus" size="big" />
        </TouchableOpacity>
      </View>
      <View style={{ marginLeft: padding }}>
        <DefaultButton
          title={`${t('Adicionar')} ${getPrice(value)}`}
          onPress={() => onChange(value)}
        />
      </View>
    </View>
  );
};
