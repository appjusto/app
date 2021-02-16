import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { borders, halfPadding, padding, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';

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
        <MaterialIcons name="filter-list" size={16} />
        <Text style={{ ...texts.xs, ...texts.bold, marginLeft: halfPadding }}>{t('Filtrar')}</Text>
      </View>
    </TouchableOpacity>
  );
}
