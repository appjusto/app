import React from 'react';
import { View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import useCuisines from '../../../../common/store/api/platform/hooks/useCuisines';
import { halfPadding, padding } from '../../../../common/styles';
import CuisinesBox from './CuisinesBox';
import DoubleHeader from './DoubleHeader';

type Props = {
  onSelect: () => void;
};

export default function ({ onSelect }: Props) {
  const cuisines = useCuisines();
  return (
    <View>
      <DoubleHeader title="Tá com fome de que?" subtitle="Escolha por categoria" />
      <View style={{ paddingVertical: padding, paddingLeft: padding }}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={cuisines}
          keyExtractor={(item) => item.name} // add an id to the Cuisine?
          renderItem={({ item }) => (
            <TouchableOpacity onPress={onSelect} style={{ marginRight: halfPadding }}>
              <CuisinesBox cuisine={item} />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}
