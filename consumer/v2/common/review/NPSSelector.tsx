import React, { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { colors, texts } from '../../../../common/styles';

type Props = {
  total: number;
  onSelect: (i: number) => void;
};

export const NPSSelector = ({ total, onSelect }: Props) => {
  const scores: ReactNode[] = [];
  for (let i = 1; i <= total; i += 1) {
    scores.push(
      <TouchableOpacity key={`key-${i}`} onPress={() => onSelect(i)}>
        <View
          style={{
            height: 48,
            width: 48,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: colors.green500,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ ...texts.md }}>{i}</Text>
        </View>
      </TouchableOpacity>
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
