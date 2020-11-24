import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';

import { ApiContext, AppDispatch } from '../common/app/context';
import Pill from '../common/components/views/Pill';
import useTallerDevice from '../common/hooks/useTallerDevice';
import { getUser } from '../common/store/user/selectors';
import { borders, colors, halfPadding, padding, screens, texts } from '../common/styles';
import { formatDistance, formatDuration, separateWithDot } from '../common/utils/formatters';
import { HomeNavigatorParamList } from '../consumer/home/types';
import { t } from '../strings';
import * as fake from './fakeData';

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

  //UI
  const RestaurantCard = () => (
    <View style={{ marginHorizontal: 12 }}>
      <Image source={fake.card} style={{ height: 120, width: '100%', borderRadius: 8 }} />
      <View
        style={{
          flexDirection: 'row',
          marginTop: 12,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Text style={{ ...texts.mediumToBig }}>{t('Nome do restaurante')}</Text>
          <Text style={{ ...texts.small, color: colors.darkGreen }}>{t('Tipo de comida')}</Text>
          <Text style={{ ...texts.small, color: colors.darkGrey }}>
            {separateWithDot(formatDistance(2000), formatDuration(1800))}
          </Text>
        </View>
        <View>
          <Image source={fake.cardIcon} />
        </View>
      </View>
    </View>
  );

  const SingleHeader = ({ category }) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: padding,
        marginBottom: halfPadding,
      }}
    >
      <Pill />
      <Text style={{ ...texts.default, marginLeft: 12 }}>
        {t('Categoria')}
        {category}
      </Text>
    </View>
  );

  const RestaurantItem = () => (
    <TouchableOpacity>
      <View
        style={{
          borderBottomWidth: 1,
          borderStyle: 'solid',
          width: '100%',
          borderColor: colors.grey,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          paddingLeft: padding,
          paddingRight: halfPadding,
          marginVertical: halfPadding,
        }}
      >
        <View style={{ width: '60%' }}>
          <Text style={{ ...texts.default }}>{t('Nome do item')}</Text>
          <Text style={{ ...texts.small, color: colors.darkGrey }} numberOfLines={2}>
            {t('Descrição do item que será exibida em até 2 linhas e o restante ficará...')}
          </Text>
          <Text style={{ ...texts.default }}>{t('R$ 00,00')}</Text>
        </View>
        <View>
          <Image source={fake.itemRectangle} style={{ height: 96, width: 96, borderRadius: 8 }} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={{ ...screens.default }}>
      <RestaurantCard />
      <SingleHeader category="#1" />
      <RestaurantItem />
      <RestaurantItem />
      <RestaurantItem />
      <RestaurantItem />
      <SingleHeader category="#2" />
      <RestaurantItem />
      <RestaurantItem />
      <RestaurantItem />
      <RestaurantItem />
      <SingleHeader category="#3" />
      <RestaurantItem />
      <RestaurantItem />
      <RestaurantItem />
      <RestaurantItem />
    </ScrollView>
  );
}
