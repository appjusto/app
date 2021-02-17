import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { colors, halfPadding, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

export default function () {
  return (
    <TouchableOpacity onPress={() => null}>
      <View style={{ marginTop: padding, paddingHorizontal: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: halfPadding }}>
          <View style={{ height: 40, width: 40, borderRadius: 8, backgroundColor: colors.white }} />
          <View style={{ marginLeft: halfPadding }}>
            <Text style={{ ...texts.md }}>{t('Nome do restaurante')}</Text>
            <Text style={{ ...texts.xs, color: colors.green600 }}>{t('Tipo de comida')}</Text>
          </View>
        </View>
        {/* TODO: add image */}
      </View>
    </TouchableOpacity>
  );
}
