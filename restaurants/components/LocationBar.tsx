import React from 'react';
import { View, Image, Text } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import * as icons from '../../assets/icons';
import { borders, colors, halfPadding, padding, texts } from '../../common/styles';
import { t } from '../../strings';

export default function () {
  return (
    <TouchableWithoutFeedback
      onPress={() => null}
      style={{ marginTop: padding, marginHorizontal: 12 }}
    >
      <View
        style={{
          ...borders.default,
          backgroundColor: colors.lightGrey,
          width: '100%',
          height: 42,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 12,
          borderRadius: 32,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={icons.navigationArrow} />
          <Text style={{ ...texts.small, marginLeft: halfPadding }}>
            {t('Avenida Paulista, 1000, São Paulo, SP')}
          </Text>
        </View>
        <Text style={{ ...texts.small, color: colors.darkGreen }}>{t('Trocar')}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}
