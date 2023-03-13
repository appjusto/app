import { Business, ConsumerProfile, Cuisine, WithId } from '@appjusto/types';
import React from 'react';
import { Image, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useSelector } from 'react-redux';
import * as icons from '../../../../assets/icons';
import DoubleHeader from '../../../../common/components/texts/DoubleHeader';
import { IconLogin } from '../../../../common/icons/icon-login';
import HomeCard from '../../../../common/screens/home/cards/HomeCard';
import { distanceBetweenLatLng } from '../../../../common/store/api/helpers';
import { getCurrentLocation } from '../../../../common/store/consumer/selectors';
import { borders, colors, halfPadding, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { RestaurantListItem } from '../restaurant/list/RestaurantListItem';
import { CuisineSelector } from './CuisineSelector';

type Props = {
  selectedCuisineId?: string;
  onChangePlace: () => void;
  onSearchPress: () => void;
  onCuisineSelect: (cuisine: WithId<Cuisine> | null) => void;
  consumer: WithId<ConsumerProfile> | undefined;
  onLogin: () => void;
  recentRestaurants: WithId<Business>[];
  onSelectRestaurant: (id: string) => void;
};

export const FoodOrderHomeHeader = ({
  selectedCuisineId,
  onChangePlace,
  onSearchPress,
  onCuisineSelect,
  consumer,
  onLogin,
  recentRestaurants,
  onSelectRestaurant,
}: Props) => {
  // redux
  const location = useSelector(getCurrentLocation);
  // console.log('HEADER CURRENTLOCATION', location);
  return (
    <View>
      {/* login */}
      {!consumer ? (
        <TouchableOpacity onPress={onLogin} style={{ marginTop: 24, paddingHorizontal: padding }}>
          <HomeCard
            icon={<IconLogin />}
            title={t('Crie uma conta ou faça o login')}
            subtitle={t('Você precisa estar logado para pedir')}
            // grey
          />
        </TouchableOpacity>
      ) : null}
      {/* search */}
      <View style={{ paddingTop: halfPadding }}>
        <DoubleHeader
          title={t('Já sabe o que quer?')}
          subtitle={t('Então vai direto no seu prato ou restaurante preferido')}
        />
      </View>
      <View style={{ marginTop: 24, paddingHorizontal: 12, marginBottom: halfPadding }}>
        <TouchableWithoutFeedback onPress={onSearchPress}>
          <View>
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
              <Text style={{ ...texts.sm, color: colors.grey700 }}>
                {t('Buscar por prato ou restaurante')}
              </Text>
              <Image source={icons.search} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
      {/* by cuisine */}
      <CuisineSelector
        selectedCuisineId={selectedCuisineId}
        onSelect={(cuisine) => onCuisineSelect(cuisine)}
      />
      {/* most recent restaurants */}
      {recentRestaurants.length > 0 ? (
        <View>
          <DoubleHeader
            title={t('Pedidos recentemente')}
            subtitle={t('Peça novamente desses lugares')}
          />
          <View style={{ paddingTop: padding }}>
            {recentRestaurants.map((restaurant) => (
              <TouchableOpacity
                onPress={() => onSelectRestaurant(restaurant.id)}
                key={restaurant.id}
              >
                <RestaurantListItem
                  id={restaurant.id}
                  restaurant={restaurant}
                  cuisine={restaurant.cuisine}
                  distance={
                    location && restaurant.businessAddress?.latlng
                      ? distanceBetweenLatLng(location, restaurant.businessAddress.latlng)
                      : undefined
                  }
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
};
