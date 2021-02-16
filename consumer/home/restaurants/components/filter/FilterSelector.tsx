import React from 'react';
import { FlatList, Text, TouchableWithoutFeedback, View } from 'react-native';
import { HorizontalSelectItem } from '../../../../../common/components/buttons/HorizontalSelect';
import { borders, colors, halfPadding, texts } from '../../../../../common/styles';
import FilterButton from './FilterButton';

type Props = {
  data: HorizontalSelectItem[];
  selected?: HorizontalSelectItem;
  onSelect: (value: HorizontalSelectItem) => void;
  onFilter: () => void;
};

export default function ({ data, selected, onSelect, onFilter }: Props) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <FilterButton onPress={onFilter} />
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback
            onPress={() => {
              onSelect(item);
            }}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: 4,
                paddingHorizontal: halfPadding,
                ...borders.default,
                borderRadius: 32,
                // height: 32,
                marginLeft: 8,
                backgroundColor: item.id === selected?.id ? colors.green500 : colors.white,
                borderColor: colors.black,
              }}
            >
              <Text
                style={{
                  ...texts.sm,
                  color: colors.black,
                }}
              >
                {item.title}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )}
      />
    </View>
  );
}
