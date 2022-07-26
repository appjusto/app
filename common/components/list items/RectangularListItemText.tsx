import React from 'react';
import { Text, TextProps, TouchableOpacity } from 'react-native';
import { colors, halfPadding, padding, texts } from '../../styles';

interface Props extends TextProps {
  text: string | number;
  textColor?: string;
  selected: boolean;
  onSelect: () => void;
}

export const RectangularListItemText = ({
  text,
  textColor = colors.black,
  selected,
  onSelect,
}: Props) => {
  return (
    <TouchableOpacity
      onPress={onSelect}
      style={{
        flex: 1,
        borderRadius: padding,
        paddingHorizontal: halfPadding,
        paddingVertical: 6,
        backgroundColor: selected ? colors.green100 : colors.white,
        borderWidth: 1,
        borderColor: selected ? colors.green100 : colors.grey500,
      }}
    >
      <Text style={{ ...texts.sm, color: textColor }}>{text}</Text>
    </TouchableOpacity>
  );
};
