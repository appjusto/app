import { Cuisine, WithId } from 'appjusto-types';
import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { halfPadding } from '../../../../common/styles';
import { t } from '../../../../strings';
import CuisineSelector from '../components/CuisineSelector';
import DoubleHeader from '../components/DoubleHeader';
import LocationBar from '../components/LocationBar';
import RestaurantSearchBar from './RestaurantSearchButton';

type Props = {
  isLoading: boolean;
  selectedCuisineId?: string;
  onLocationPress: () => void;
  onSearchPress: () => void;
  onCuisineSelect: (cuisine: WithId<Cuisine> | null) => void;
};

export default function ({
  selectedCuisineId,
  onLocationPress,
  onSearchPress,
  onCuisineSelect,
}: Props) {
  return (
    <View>
      <TouchableWithoutFeedback onPress={onLocationPress}>
        <View style={{ paddingTop: 12, paddingHorizontal: 12 }}>
          <LocationBar />
        </View>
      </TouchableWithoutFeedback>
      {/* search */}
      <DoubleHeader
        title={t('Já sabe o que quer?')}
        subtitle={t('Então vai direto no seu prato ou restaurante preferido')}
      />
      <View style={{ marginTop: 24, paddingHorizontal: 12, marginBottom: halfPadding }}>
        <TouchableWithoutFeedback onPress={onSearchPress}>
          <View>
            <RestaurantSearchBar />
          </View>
        </TouchableWithoutFeedback>
      </View>
      {/* by cuisine */}
      <CuisineSelector
        selectedCuisineId={selectedCuisineId}
        onSelect={(cuisine) => onCuisineSelect(cuisine)}
      />
    </View>
  );
}
