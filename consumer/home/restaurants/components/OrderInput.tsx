import React from 'react';
import { Text, View } from 'react-native';
import ArrowBox from '../../../../common/components/views/ArrowBox';
import { borders, colors, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

export default function () {
  return (
    <View
      style={{
        height: 60,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...borders.default,
        borderColor: colors.black,
        paddingHorizontal: 12,
      }}
    >
      <Text style={{ ...texts.xs, ...texts.bold }}>
        {t('Ordenar por: ')}
        <Text style={{ ...texts.xs }}>{t('Adicionados recentemente')}</Text>
      </Text>
      <ArrowBox />
    </View>
  );
}
