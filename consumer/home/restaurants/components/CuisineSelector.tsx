import { Cuisine, WithId } from 'appjusto-types';
import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import useCuisines from '../../../../common/store/api/platform/hooks/useCuisines';
import { halfPadding, padding } from '../../../../common/styles';
import { t } from '../../../../strings';
import CuisinesBox from './CuisinesBox';
import DoubleHeader from './DoubleHeader';

type Props = {
  onSelect: (cuisine: WithId<Cuisine>) => void;
};

export default function ({ onSelect }: Props) {
  const cuisines = useCuisines();
  return (
    <View>
      <DoubleHeader title={t('Tá com fome de que?')} subtitle={t('Escolha por categoria')} />
      <View style={{ paddingVertical: padding, paddingLeft: padding }}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={cuisines}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onSelect(item)} style={{ marginRight: halfPadding }}>
              <CuisinesBox cuisine={item} />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}
