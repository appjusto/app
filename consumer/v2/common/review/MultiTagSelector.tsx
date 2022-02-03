import { ReviewTag } from '@appjusto/types';
import React from 'react';
import { FlatList, Text, TouchableWithoutFeedback, View } from 'react-native';
import { borders, colors, halfPadding, padding, texts } from '../../../../common/styles';

type Props = {
  data: ReviewTag[];
  disabled?: boolean;
};

export const MultiTagSelector = ({ data, disabled }: Props) => {
  // helpers
  const selectedTags: ReviewTag[] = [];
  const onSelect = (tag: ReviewTag) => {
    if (selectedTags.includes(tag)) selectedTags.filter((t) => t.id !== tag.id);
    if (!selectedTags.includes(tag)) selectedTags.push(tag);
  };
  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      horizontal
      data={data}
      keyExtractor={(item) => item.id + item.type}
      renderItem={({ item }) => {
        const tagIsSelected = selectedTags.includes(item);
        return (
          <TouchableWithoutFeedback
            onPress={() => {
              if (!disabled) onSelect(item);
            }}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 8,
                paddingHorizontal: padding,
                ...borders.default,
                borderRadius: 6,
                height: 40,
                marginRight: halfPadding,
                backgroundColor: tagIsSelected ? colors.green100 : colors.white,
                borderColor: tagIsSelected ? colors.black : colors.grey500,
              }}
            >
              <Text
                style={{
                  ...texts.sm,
                  color: tagIsSelected ? colors.black : colors.grey700,
                }}
              >
                {item.title}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        );
      }}
    />
  );
};
