import React from 'react';
import { View } from 'react-native';
import { ConsumerCarousel } from './carousel/ConsumerCarousel';
import { LocationBar } from './location/LocationBar';

interface Props {
  onChangePlace: () => void;
}

export const FoodOrderHomeHeaderV3 = ({ onChangePlace }: Props) => {
  return (
    <View>
      <LocationBar onChangePlace={onChangePlace} />
      <ConsumerCarousel />
    </View>
  );
};
