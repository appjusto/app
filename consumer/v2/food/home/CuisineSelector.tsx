import { Cuisine, WithId } from '@appjusto/types';
import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import DoubleHeader from '../../../../common/components/texts/DoubleHeader';
import useCuisines from '../../../../common/store/api/platform/hooks/useCuisines';
import { halfPadding, padding } from '../../../../common/styles';
import { t } from '../../../../strings';
import CuisinesBox from './CuisinesBox';

type Props = {
  selectedCuisineId?: string;
  onSelect: (cuisine: WithId<Cuisine> | null) => void;
};

export const CuisineSelector = ({ selectedCuisineId, onSelect }: Props) => {
  const cuisines = useCuisines();
  return cuisines?.length ? (
    <View style={{ paddingTop: halfPadding }}>
      <DoubleHeader title={t('Tá com fome de quê?')} subtitle={t('Escolha por categoria')} />
      <View style={{ paddingVertical: padding, paddingLeft: padding }}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={cuisines}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => (selectedCuisineId === item.name ? onSelect(null) : onSelect(item))}
            >
              <CuisinesBox cuisine={item} selected={selectedCuisineId === item.name} />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  ) : null;
};
