import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { halfPadding } from '../../../../common/styles';
import { t } from '../../../../strings';
import CusineSelector from '../components/CusineSelector';
import DoubleHeader from '../components/DoubleHeader';
import LocationBar from '../components/LocationBar';
import RestaurantSearchBar from './RestaurantSearchButton';

type Props = {
  onLocationPress: () => void;
  onSearchPress: () => void;
};

export default function ({ onLocationPress, onSearchPress }: Props) {
  return (
    <View>
      <TouchableWithoutFeedback onPress={onLocationPress}>
        <View style={{ paddingTop: 12, paddingHorizontal: 12 }}>
          <LocationBar />
        </View>
      </TouchableWithoutFeedback>
      {/* search */}
      <DoubleHeader
        title={t('Buscar')}
        subtitle={t('Já sabe o que quer? Então não perde tempo!')}
      />
      <View style={{ marginTop: 24, paddingHorizontal: 12, marginBottom: halfPadding }}>
        <TouchableWithoutFeedback onPress={onSearchPress}>
          <View>
            <RestaurantSearchBar />
          </View>
        </TouchableWithoutFeedback>
      </View>
      {/* by cuisine */}
      <CusineSelector />
    </View>
  );
}
