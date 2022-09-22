import React from 'react';
import { Text, View } from 'react-native';
import SingleHeader from '../../../common/components/texts/SingleHeader';
import HR from '../../../common/components/views/HR';
import { borders, colors, halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

type Props = {
  code?: string;
};

export const OrderNumber = ({ code }: Props) => {
  return (
    <View style={{ backgroundColor: colors.white, paddingTop: halfPadding, flex: 1 }}>
      <SingleHeader title={t('Retirada')} />
      <View style={{ paddingHorizontal: padding }}>
        <Text style={{ ...texts.xs, color: colors.grey700 }}>
          {t('Apresente o número do pedido no momento da retirada no restaurante.')}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: padding,
          flex: 1,
        }}
      >
        <View
          style={{
            ...borders.default,
            backgroundColor: colors.white,
            borderColor: colors.black,
            borderWidth: 2,
            borderRadius: 32,
          }}
        />
        <Text style={{ ...texts.sm, marginLeft: halfPadding }}>{t('Número do pedido: ')}</Text>
        <Text style={{ ...texts.x4l, marginLeft: halfPadding }}>#{code ?? ''}</Text>
      </View>
      <View style={{ height: padding }} />
      <HR height={padding} />
    </View>
  );
};
