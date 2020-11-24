import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';

import { ApiContext, AppDispatch } from '../common/app/context';
import useTallerDevice from '../common/hooks/useTallerDevice';
import { getUser } from '../common/store/user/selectors';
import { colors, padding, screens, texts } from '../common/styles';
import { HomeNavigatorParamList } from '../consumer/home/types';
import { t } from '../strings';
import * as fake from './fakeData';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList>;

type Props = {
  navigation: ScreenNavigationProp;
};

export default function ({ navigation }: Props) {
  // context
  // const api = useContext(ApiContext);
  // const dispatch = useDispatch<AppDispatch>();
  // const tallerDevice = useTallerDevice();
  // app state
  // const user = useSelector(getUser)!;
  //UI
  return (
    <ScrollView style={{ ...screens.default }}>
      <View style={{ paddingHorizontal: 12 }}>
        <Image source={fake.detail} style={{ width: '100%', height: 240, borderRadius: 8 }} />
        <View style={{ marginTop: padding }}>
          <Text style={{ ...texts.mediumToBig }}>{t('Nome do item')}</Text>
          <Text style={{ ...texts.default, color: colors.darkGrey, marginVertical: 4 }}>
            {t('Descrição completa do item que será exibida em até na página interna do item.')}
          </Text>
          <Text style={{ ...texts.default }}>{t('R$ 00,00')}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
