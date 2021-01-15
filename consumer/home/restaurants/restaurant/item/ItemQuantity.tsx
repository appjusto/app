import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import * as icons from '../../../../../assets/icons';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import { borders, halfPadding, padding } from '../../../../../common/styles';
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
          <View
            style={{
              height: 48,
              width: 48,
              alignItems: 'center',
              justifyContent: 'center',
              ...borders.default,
            }}
          >
            <Image source={icons.minus} />
          </View>
        </TouchableOpacity>
        <Text style={{ marginHorizontal: padding }}>{value}</Text>
        <TouchableOpacity onPress={() => setValue(value + 1)}>
          <View
            style={{
              height: 48,
              width: 48,
              alignItems: 'center',
              justifyContent: 'center',
              ...borders.default,
            }}
          >
            <Image source={icons.plus} />
          </View>
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
