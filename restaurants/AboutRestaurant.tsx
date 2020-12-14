import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import * as icons from '../assets/icons';
import { colors, halfPadding, padding, screens, texts } from '../common/styles';
import { HomeNavigatorParamList } from '../consumer/home/types';
import { t } from '../strings';
import RestaurantCard from './components/RestaurantCard';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList>;
type ScreenRouteProp = RouteProp<HomeNavigatorParamList, 'AboutRestaurant'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ route }: Props) {
  const { restaurant } = route.params ?? {};

  return (
    <ScrollView style={{ ...screens.default }}>
      <RestaurantCard name={restaurant.name} />
      {/* description */}
      <View style={{ marginTop: padding, padding }}>
        <Text style={{ ...texts.default }}>
          {t(
            'O Restaurante é uma casa rústica influenciada pela gastronomia portuense e pela proximidade do mar. Situado na Vila Madalena, é um dos mais emblemáticos restaurantes da freguesia.'
          )}
        </Text>
        <Text style={{ marginTop: 24, ...texts.default }}>
          {t(
            'Surgiu em 1971 numa simples casa, tendo mais tarde sido passado por uma reestruturação, dando origem a um restaurante igualmente típico e pitoresco mas com espaço e comodidade substancialmente diferentes.'
          )}
        </Text>
        <Text style={{ marginTop: padding, ...texts.default, color: colors.darkGrey }}>
          {t('Valor mínimo de pedido R$ 00,00')}
        </Text>
      </View>
      <View style={{ width: '100%', height: padding, backgroundColor: colors.lightGrey }} />
      <View style={{ marginTop: padding, paddingHorizontal: padding }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={icons.clock} />
          <Text style={{ ...texts.default, marginLeft: halfPadding }}>
            {t('Horário de entrega')}
          </Text>
        </View>
      </View>
      <View style={{ width: '100%', height: padding, backgroundColor: colors.lightGrey }} />
    </ScrollView>
  );
}
