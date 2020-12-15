import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
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

  if (!restaurant)
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );

  return (
    <ScrollView style={{ ...screens.default }}>
      <RestaurantCard name={restaurant.name} />
      <View style={{ marginTop: padding, padding }}>
        <Text style={{ ...texts.default }}>{restaurant.description}</Text>
        <Text style={{ marginTop: 24, ...texts.default }}>{restaurant.description}</Text>
        <Text style={{ marginTop: padding, ...texts.default, color: colors.darkGrey }}>
          {t('Valor mínimo de pedido R$')}
          {restaurant.minimumOrder}
          {t(',00')}
        </Text>
      </View>
      <View style={{ width: '100%', height: padding, backgroundColor: colors.lightGrey }} />
      <View style={{ marginTop: padding, paddingHorizontal: padding, paddingBottom: padding }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={icons.clock} />
          <Text style={{ ...texts.default, marginLeft: halfPadding }}>
            {t('Horário de entrega')}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: halfPadding,
            marginLeft: 20,
          }}
        >
          <View>
            <Text style={{ ...texts.default, color: colors.darkGrey }}>{t('Domingo')}</Text>
            <Text style={{ ...texts.default, color: colors.darkGrey }}>{t('Segunda')}</Text>
            <Text style={{ ...texts.default, color: colors.darkGrey }}>{t('Terça')}</Text>
            <Text style={{ ...texts.default, color: colors.darkGrey }}>{t('Quarta')}</Text>
            <Text style={{ ...texts.default, color: colors.darkGrey }}>{t('Quinta')}</Text>
            <Text style={{ ...texts.default, color: colors.darkGrey }}>{t('Sexta')}</Text>
            <Text style={{ ...texts.default, color: colors.darkGrey }}>{t('Sábado')}</Text>
          </View>
          <View style={{ marginLeft: 24 }}>
            <Text style={{ ...texts.default, color: colors.darkGrey }}>{t('Fechado')}</Text>
            <Text style={{ ...texts.default, color: colors.darkGrey }}>{t('12:00 às 19:00')}</Text>
            <Text style={{ ...texts.default, color: colors.darkGrey }}>{t('12:00 às 19:00')}</Text>
            <Text style={{ ...texts.default, color: colors.darkGrey }}>{t('12:00 às 19:00')}</Text>
            <Text style={{ ...texts.default, color: colors.darkGrey }}>{t('12:00 às 19:00')}</Text>
            <Text style={{ ...texts.default, color: colors.darkGrey }}>{t('12:00 às 19:00')}</Text>
            <Text style={{ ...texts.default, color: colors.darkGrey }}>{t('12:00 às 19:00')}</Text>
          </View>
        </View>
      </View>
      <View style={{ width: '100%', height: padding, backgroundColor: colors.lightGrey }} />
      <View style={{ marginTop: padding, paddingHorizontal: padding, paddingBottom: padding }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={icons.info} />
          <Text style={{ ...texts.default, marginLeft: halfPadding }}>
            {t('Outras informações')}
          </Text>
        </View>
        <View style={{ marginLeft: 20, marginTop: halfPadding }}>
          <Text style={{ ...texts.default, color: colors.darkGrey }}>
            {restaurant.businessAddress.address}
            {t(', ')}
            {restaurant.businessAddress.number}
          </Text>
          {/* neighborhood hard coded for now... we need this field in the admin */}
          <Text style={{ ...texts.default, color: colors.darkGrey }}>Bairro</Text>
          <Text style={{ ...texts.default, color: colors.darkGrey }}>
            {restaurant.businessAddress.city}
            {t(', ')}
            {restaurant.businessAddress.state}
          </Text>
          <Text style={{ ...texts.default, color: colors.darkGrey }}>
            {t('CEP: ')}
            {restaurant.businessAddress.cep}
          </Text>
          <Text style={{ ...texts.default, color: colors.darkGrey }}>
            {t('CNPJ ')}
            {restaurant.cnpj}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
