import { ReviewTag } from '@appjusto/types';
import React from 'react';
import { ActivityIndicator, FlatList, Text, TouchableWithoutFeedback, View } from 'react-native';
import { borders, colors, halfPadding, padding, screens, texts } from '../../../../common/styles';

type Props = {
  data: ReviewTag[];
  disabled?: boolean;
  selectedTags: ReviewTag[];
};

export const MultiTagSelector = ({ data, disabled, selectedTags }: Props) => {
  // helpers
  const onSelect = (tag: ReviewTag) => {
    if (selectedTags.includes(tag)) selectedTags.filter((t) => t.id !== tag.id);
    if (!selectedTags.includes(tag)) selectedTags.push(tag);
  };
  // UI
  if (!data) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="small" color={colors.green500} />
      </View>
    );
  }
  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      horizontal
      data={data}
      keyExtractor={(item) => item.id + item.type}
      renderItem={({ item }) => {
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
                backgroundColor: selectedTags.includes(item) ? colors.green100 : colors.white,
                borderColor: selectedTags.includes(item) ? colors.black : colors.grey500,
              }}
            >
              <Text
                style={{
                  ...texts.sm,
                  color: selectedTags.includes(item) ? colors.black : colors.grey700,
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
