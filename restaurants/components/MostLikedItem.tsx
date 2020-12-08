import React from 'react';
import { View, Image, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { colors, halfPadding, padding, texts } from '../../common/styles';
import { t } from '../../strings';
import * as fake from '../fakeData';

export default function () {
  return (
    <TouchableOpacity onPress={() => null}>
      <View style={{ marginTop: padding, paddingHorizontal: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: halfPadding }}>
          <Image source={fake.whiteSquare} style={{ height: 40, width: 40, borderRadius: 8 }} />
          <View style={{ marginLeft: halfPadding }}>
            <Text style={{ ...texts.medium }}>{t('Nome do restaurante')}</Text>
            <Text style={{ ...texts.small, color: colors.darkGreen }}>{t('Tipo de comida')}</Text>
          </View>
        </View>
        <Image source={fake.likedImage} style={{ height: 120, width: 304, borderRadius: 8 }} />
      </View>
    </TouchableOpacity>
  );
}
