import { Cuisine, WithId } from '@appjusto/types';
import React from 'react';
import { View } from 'react-native';
import { CuisineSelector } from '../../../../v2/food/home/CuisineSelector';
import { ConsumerCarousel } from './carousel/ConsumerCarousel';
import { LocationBar } from './location/LocationBar';
import { FoodOrderHomeRecent } from './recent/FoodOrderHomeRecent';
import { FoodOrderHomeHeaderRestaurantSearch } from './search/FoodOrderHomeHeaderRestaurantSearch';

interface Props {
  selectedCuisineId?: string;
  onLoginClick: () => void;
  onChangePlace: () => void;
  onSearchPress: () => void;
  onCuisineSelect: (cuisine: WithId<Cuisine> | null) => void;
  onSelectBusiness: (businessId: string) => void;
}

export const FoodOrderHomeHeaderV3 = ({
  selectedCuisineId,
  onLoginClick,
  onChangePlace,
  onSearchPress,
  onCuisineSelect,
  onSelectBusiness,
}: Props) => {
  return (
    <View>
      <LocationBar onChangePlace={onChangePlace} />
      <ConsumerCarousel onLoginClick={onLoginClick} />
      <FoodOrderHomeHeaderRestaurantSearch onSearchPress={onSearchPress} />
      <CuisineSelector selectedCuisineId={selectedCuisineId} onSelect={onCuisineSelect} />
      <FoodOrderHomeRecent onSelectBusiness={onSelectBusiness} />
    </View>
  );
};
