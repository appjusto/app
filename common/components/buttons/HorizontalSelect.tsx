import React from 'react';
import { FlatList, Text, TouchableWithoutFeedback, View } from 'react-native';

import { borders, colors } from '../../styles';

export type HorizontalSelectItem = {
  title: string;
  id: string;
  data?: any;
};

type Props = {
  data: HorizontalSelectItem[];
  selected?: HorizontalSelectItem;
  onSelect: (value: HorizontalSelectItem) => void;
  disabled?: boolean;
};

export default function ({ data, selected, onSelect, disabled }: Props) {
  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      horizontal
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableWithoutFeedback
          onPress={() => {
            if (!disabled) onSelect(item);
          }}
        >
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: 8,
              ...borders.default,
              borderRadius: 6,
              height: 40,
              marginRight: 4,
              backgroundColor:
                item.id === selected?.id
                  ? disabled
                    ? colors.lightGrey
                    : colors.green
                  : colors.white,
            }}
          >
            <Text>{item.title}</Text>
          </View>
        </TouchableWithoutFeedback>
      )}
    />
  );
}
