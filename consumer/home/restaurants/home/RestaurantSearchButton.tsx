import React from 'react';
import { Image, Text, View } from 'react-native';
import * as icons from '../../../../assets/icons';
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
        paddingHorizontal: 12,
        ...borders.default,
        borderColor: colors.black,
      }}
    >
      <Text style={{ ...texts.default, color: colors.darkGrey }}>
        {t('Encontre um prato ou restaurante')}
      </Text>
      <Image source={icons.search} />
    </View>
  );
}
