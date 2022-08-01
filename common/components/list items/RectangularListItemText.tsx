import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { colors, padding, texts } from '../../styles';

interface Props extends TouchableOpacityProps {
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
  style,
}: Props) => {
  return (
    <TouchableOpacity
      onPress={onSelect}
      style={[
        {
          // flex: 1,
          borderRadius: padding,
          paddingHorizontal: padding,
          paddingVertical: 6,
          backgroundColor: selected ? colors.green100 : colors.white,
          borderWidth: 1,
          borderColor: selected ? colors.green100 : colors.grey500,
          alignItems: 'center',
        },
        style,
      ]}
    >
      <Text style={{ ...texts.sm, color: textColor }}>{text}</Text>
    </TouchableOpacity>
  );
};
