import React from 'react';
import { Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import { borders, colors, texts } from '../../styles';

type Props = {
  title: string;
  icon: any;
  active?: boolean;
  onPress: () => void;
};

export default function ({ title, icon, active = false, onPress }: Props) {
  return (
    <View style={{ alignItems: 'center' }}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View
          style={{
            width: 48,
            height: 48,
            backgroundColor: active ? colors.green500 : colors.grey50,
            ...borders.default,
            borderColor: active ? colors.green500 : colors.grey50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image source={icon} />
        </View>
      </TouchableWithoutFeedback>
      <Text style={[texts.xs, { color: active ? colors.black : colors.grey700 }]}>{title}</Text>
    </View>
  );
}
