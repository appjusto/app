import { Cuisine, WithId } from 'appjusto-types';
import React from 'react';
import { Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import * as icons from '../../../../assets/icons';
import DoubleHeader from '../../../../common/components/texts/DoubleHeader';
import { borders, colors, halfPadding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { CuisineSelector } from './CuisineSelector';
import { LocationBar } from './LocationBar';

type Props = {
  isLoading: boolean;
  selectedCuisineId?: string;
  onLocationPress: () => void;
  onSearchPress: () => void;
  onCuisineSelect: (cuisine: WithId<Cuisine> | null) => void;
};

export const FoodOrderHomeHeader = ({
  selectedCuisineId,
  onLocationPress,
  onSearchPress,
  onCuisineSelect,
}: Props) => {
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
    </View>
  );
};
