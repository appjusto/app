import React from 'react';
import { FlatList, Text, TouchableWithoutFeedback, View } from 'react-native';
import { borders, colors, halfPadding, texts } from '../../styles';

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
  selectFilter?: boolean;
};

export default function ({ data, selected, onSelect, disabled, selectFilter }: Props) {
  return selectFilter ? (
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
              padding: 4,
              paddingHorizontal: halfPadding,
              ...borders.default,
              borderRadius: 32,
              height: 32,
              marginLeft: 8,
              backgroundColor: item.id === selected?.id ? colors.darkGreen : colors.white,
              borderColor: colors.black,
            }}
          >
            <Text
              style={{
                ...texts.default,
                color: colors.black,
              }}
            >
              {item.title}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      )}
    />
  ) : (
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
              backgroundColor: item.id === selected?.id ? colors.lightGreen : colors.white,
              borderColor: item.id === selected?.id ? colors.black : colors.grey,
            }}
          >
            <Text
              style={{
                ...texts.default,
                color: item.id === selected?.id ? colors.black : colors.darkGrey,
              }}
            >
              {item.title}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      )}
    />
  );
}
