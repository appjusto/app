import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { colors, halfPadding, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

export default function () {
  return (
    <TouchableOpacity onPress={() => null}>
      <View style={{ marginTop: padding, paddingHorizontal: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: halfPadding }}>
          <View style={{ height: 40, width: 40, borderRadius: 8, backgroundColor: colors.white }} />
          <View style={{ marginLeft: halfPadding }}>
            <Text style={{ ...texts.medium }}>{t('Nome do restaurante')}</Text>
            <Text style={{ ...texts.small, color: colors.darkGreen }}>{t('Tipo de comida')}</Text>
          </View>
        </View>
        {/* TODO: add image */}
      </View>
    </TouchableOpacity>
  );
}
