import React from 'react';
import { Text, View } from 'react-native';
import { borders, colors, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

type Props = {
  variant: 'pix' | 'card';
  selected: boolean;
};

export const PaymentBoxSelector = ({ variant, selected }: Props) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding,
        height: 86,
        width: '100%',
        ...borders.default,
        backgroundColor: selected ? colors.white : colors.grey50,
        borderColor: selected ? colors.black : colors.grey500
      }}
    >
      <View>{variant === 'pix' ? <Text style={{ ...texts.sm }}>{t('Pix')}</Text> : null}</View>
      <View></View>
    </View>
  );
};
