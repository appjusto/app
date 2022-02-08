import { ReviewTag } from '@appjusto/types';
import React from 'react';
import { FlatList, Text, TouchableWithoutFeedback, View } from 'react-native';
import { borders, colors, halfPadding, padding, texts } from '../../../../common/styles';

type Props = {
  tags: ReviewTag[] | undefined;
  selectedTags: ReviewTag[];
  disabled?: boolean;
  onChange: (tags: ReviewTag[]) => void;
};

export const MultiTagSelector = ({ tags, disabled, selectedTags, onChange }: Props) => {
  // helpers
  const onSelect = (tag: ReviewTag) => {
    const index = selectedTags.findIndex((value) => value.id === tag.id);
    if (index < 0) onChange([...selectedTags, tag]);
    else onChange([...selectedTags.slice(0, index), ...selectedTags.slice(index + 1)]);
  };
  return tags ? (
    <FlatList
      showsHorizontalScrollIndicator={false}
      horizontal
      data={tags}
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
  ) : null;
};
