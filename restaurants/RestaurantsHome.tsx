import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';

import { ApiContext, AppDispatch } from '../common/app/context';
import Pill from '../common/components/views/Pill';
import useTallerDevice from '../common/hooks/useTallerDevice';
import { getUser } from '../common/store/user/selectors';
import { borders, colors, screens, texts } from '../common/styles';
import { HomeNavigatorParamList } from '../consumer/home/types';
import { t } from '../strings';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList>;

type Props = {
  navigation: ScreenNavigationProp;
};

export default function ({ navigation }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const tallerDevice = useTallerDevice();

  // app state
  const user = useSelector(getUser)!;

  return (
    <ScrollView style={{ ...screens.default }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 24, flex: 1 }}>
        <Pill tall />
        <View style={{ marginLeft: 12 }}>
          <Text style={{ ...texts.mediumToBig, color: colors.black }}>{t('Os mais queridos')}</Text>
          <Text style={{ ...texts.small, color: colors.darkGrey }}>
            {t('Os lugares mais pedidos da sua região')}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
