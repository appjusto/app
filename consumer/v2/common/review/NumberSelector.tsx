import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { borders, colors, halfPadding, padding, texts } from '../../../../common/styles';

type Props = {
  onChange: (i: number) => void;
  value: number;
};

export const NumberSelector = ({ onChange, value }: Props) => {
  const numbers = [];
  for (let i = 1; i <= 5; i += 1) {
    numbers.push(
      <TouchableOpacity onPress={() => onChange(i)} key={`key-${i}`}>
        <View
          style={{
            ...borders.default,
            borderColor: colors.green500,
            backgroundColor: i === value ? colors.green500 : colors.white,
            height: 48,
            width: 48,
            borderRadius: 24,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ ...texts.md, ...texts.bold }}>{i}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: padding,
        paddingBottom: padding,
        paddingTop: halfPadding,
      }}
    >
      {numbers}
    </View>
  );
};
