import { ComplementGroup } from '@appjusto/types';
import React from 'react';
import { Text, View, ViewProps } from 'react-native';
import { borders, colors, halfPadding, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';

interface Props extends ViewProps {
  group: ComplementGroup;
  totalSelected: number;
}

export const ItemComplementRequiredLabel = ({ group, totalSelected, style }: Props) => {
  const { required } = group;
  return (
    <View
      style={[
        {
          flexDirection: 'row',
        },
        style,
      ]}
    >
      <View
        style={{
          paddingVertical: 2,
          paddingHorizontal: halfPadding,
          backgroundColor: required ? colors.green500 : colors.grey500,
          ...borders.squared,
          borderColor: required ? colors.green500 : colors.grey500,
        }}
      >
        <Text
          style={{
            ...texts.x2s,
            ...texts.bold,
            color: required ? colors.black : colors.grey700,
          }}
        >
          {required ? t('OBRIGATÓRIO') : t('OPCIONAL')}
        </Text>
      </View>
      <Text style={{ ...texts.sm, marginLeft: halfPadding }}>{`${t(
        'Selecionado'
      )} ${totalSelected} ${t('de')} ${group.maximum}`}</Text>
    </View>
  );
};
