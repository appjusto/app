import React from 'react';
import { View, Text, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import * as icons from '../../../../../assets/icons';
import RoundedText from '../../../../../common/components/texts/RoundedText';
import { borders, colors, padding, texts } from '../../../../../common/styles';

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
        <Text style={{ ...texts.medium }}>{title}</Text>
        <RoundedText>{value}</RoundedText>
      </View>
      <Text style={{ ...texts.default, color: colors.darkGrey }}>{description}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
        <TouchableOpacity onPress={onDecrease}>
          <View
            style={{
              ...borders.default,
              width: 48,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.white,
              borderColor: colors.black,
            }}
          >
            <Image source={icons.minus} />
          </View>
        </TouchableOpacity>
        <Text style={{ ...texts.medium, marginHorizontal: 16 }}>{value}</Text>
        <TouchableOpacity onPress={onIncrease}>
          <View
            style={{
              ...borders.default,
              width: 48,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.white,
              borderColor: colors.black,
            }}
          >
            <Image source={icons.plus} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
