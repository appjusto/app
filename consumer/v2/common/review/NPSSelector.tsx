import React, { ReactNode } from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import { colors, texts } from '../../../../common/styles';

type Props = {
  onSelect?: (value: number) => void;
  selected?: number;
  disabled?: boolean;
};

export const NPSSelector = ({ onSelect, selected, disabled }: Props) => {
  const scores: ReactNode[] = [];
  for (let i = 1; i <= 5; i += 1) {
    scores.push(
      <TouchableWithoutFeedback
        key={`key-${i}`}
        onPress={() => {
          if (!disabled && onSelect) onSelect(i);
        }}
      >
        <View
          style={{
            height: 48,
            width: 48,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: colors.green500,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: selected === i ? colors.green500 : colors.white,
          }}
        >
          <Text style={{ ...texts.md }}>{i}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
  return (
    <View
      style={{
        height: 80,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {scores}
    </View>
  );
};
