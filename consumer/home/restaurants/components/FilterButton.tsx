import React from 'react';
import { Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as icons from '../../../../assets/icons';
import { borders, halfPadding, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

type Props = {
  onPress: () => void;
};

export default function ({ onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginRight: padding }}>
      <View
        style={{
          ...borders.default,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          padding: halfPadding,
          width: 80,
        }}
      >
        <Image source={icons.filter} style={{ marginRight: halfPadding }} />
        <Text style={[{ ...texts.small }, { ...texts.bold }]}>{t('Filtrar')}</Text>
      </View>
    </TouchableOpacity>
  );
}
