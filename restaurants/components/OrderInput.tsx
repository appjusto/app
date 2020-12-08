import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import ArrowBox from '../../common/components/views/ArrowBox';
import { borders, colors, padding, texts } from '../../common/styles';
import { HomeNavigatorParamList } from '../../consumer/home/types';
import { t } from '../../strings';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList>;

type Props = {
  navigation: ScreenNavigationProp;
};

export default function ({ navigation }: Props) {
  return (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate('OrderBy')}
      style={{ marginHorizontal: 12, marginTop: padding }}
    >
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
        <Text style={{ ...texts.small, ...texts.bold }}>
          {t('Ordenar por: ')}
          <Text style={{ ...texts.small }}>{t('Adicionados recentemente')}</Text>
        </Text>
        <ArrowBox />
      </View>
    </TouchableWithoutFeedback>
  );
}
