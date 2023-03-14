import { Cuisine, WithId } from '@appjusto/types';
import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import PaddedView from '../../../../common/components/containers/PaddedView';
import useCuisines from '../../../../common/store/api/platform/hooks/useCuisines';
import CuisinesBox from './CuisinesBox';

type Props = {
  selectedCuisineId?: string;
  onSelect: (cuisine: WithId<Cuisine> | null) => void;
};

export const CuisineSelector = ({ selectedCuisineId, onSelect }: Props) => {
  // state
  const cuisines = useCuisines();
  // UI
  if (!cuisines?.length) return null;
  return (
    <PaddedView vertical={false}>
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
    </PaddedView>
  );
};
