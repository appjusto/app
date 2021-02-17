import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { QuantityButton } from '../../../../../common/components/buttons/QuantityButton';
import RoundedText from '../../../../../common/components/texts/RoundedText';
import { colors, padding, texts } from '../../../../../common/styles';

type Props = {
  title: string;
  value: string;
  description: string;
  onIncrease: () => void;
  onDecrease: () => void;
};

export default function ({ title, value, description, onIncrease, onDecrease }: Props) {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: padding,
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <Text style={{ ...texts.md }}>{title}</Text>
        <RoundedText>{value}</RoundedText>
      </View>
      <Text style={{ ...texts.sm, color: colors.grey700 }}>{description}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
        <TouchableOpacity onPress={onDecrease}>
          <QuantityButton sign="minus" size="big" />
        </TouchableOpacity>
        <Text style={{ ...texts.md, marginHorizontal: 16 }}>{value}</Text>
        <TouchableOpacity onPress={onIncrease}>
          <QuantityButton sign="plus" size="big" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
