import { Feather } from '@expo/vector-icons';
import * as cnpjutils from '@fnando/cnpj';
import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useContextBusiness } from '../../../../../common/store/context/business';
import { colors, halfPadding, padding, screens, texts } from '../../../../../common/styles';
import { formatCurrency, formatHour } from '../../../../../common/utils/formatters';
import { t } from '../../../../../strings';
import { RestaurantHeader } from '../../common/RestaurantHeader';
import { RestaurantNavigatorParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<RestaurantNavigatorParamList>;
type ScreenRouteProp = RouteProp<RestaurantNavigatorParamList, 'AboutRestaurant'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const AboutRestaurant = ({ route }: Props) => {
  const restaurant = useContextBusiness();

  if (!restaurant || !restaurant.businessAddress)
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );

  return (
    <ScrollView style={{ ...screens.default }}>
      <RestaurantHeader restaurant={restaurant} />
      <View style={{ marginTop: padding, padding }}>
        <Text style={{ ...texts.sm }}>{restaurant.description}</Text>
        <Text style={{ marginTop: padding, ...texts.sm, color: colors.grey700 }}>
          {t('Valor mínimo de pedido ')}
          {formatCurrency(restaurant.minimumOrder ?? 0)}
        </Text>
      </View>
      <View style={{ width: '100%', height: padding, backgroundColor: colors.grey50 }} />
      <View style={{ marginTop: padding, paddingHorizontal: padding, paddingBottom: padding }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Feather name="clock" size={14} />
          <Text style={{ ...texts.sm, marginLeft: halfPadding }}>{t('Horário de entrega')}</Text>
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
            {restaurant.schedules.map((item) => (
              <Text style={{ ...texts.sm, color: colors.grey700 }} key={item.day}>
                {item.day}
              </Text>
            ))}
          </View>
          <View style={{ marginLeft: 24 }}>
            {restaurant.schedules.map((item) => {
              const openTime = item.schedule[0].from;
              const closeTime = item.schedule[0].to;
              return !item.checked ? (
                <Text style={{ ...texts.sm, color: colors.grey700 }} key={item.day}>
                  {t('Fechado')}
                </Text>
              ) : (
                <Text style={{ ...texts.sm, color: colors.grey700 }} key={item.day}>
                  {`${formatHour(openTime)} ${t('às')} ${formatHour(closeTime)}`}
                </Text>
              );
            })}
          </View>
        </View>
      </View>
      <View style={{ width: '100%', height: padding, backgroundColor: colors.grey50 }} />
      <View style={{ marginTop: padding, paddingHorizontal: padding, paddingBottom: padding }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Feather name="info" size={14} />
          <Text style={{ ...texts.sm, marginLeft: halfPadding }}>{t('Outras informações')}</Text>
        </View>
        <View style={{ marginLeft: 20, marginTop: halfPadding }}>
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            {restaurant.businessAddress.address}
            {t(', ')}
            {restaurant.businessAddress.number}
          </Text>
          {/* neighborhood hard coded for now... we need this field in the admin */}
          <Text style={{ ...texts.sm, color: colors.grey700 }}>Bairro</Text>
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            {restaurant.businessAddress.city}
            {t(', ')}
            {restaurant.businessAddress.state}
          </Text>
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            {t('CEP: ')}
            {restaurant.businessAddress.cep}
          </Text>
          {restaurant.cnpj ? (
            <Text style={{ ...texts.sm, color: colors.grey700, marginTop: 32 }}>
              {t('CNPJ ')}
              {cnpjutils.format(restaurant.cnpj)}
            </Text>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
};
