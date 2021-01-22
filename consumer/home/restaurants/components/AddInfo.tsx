import React from 'react';
import { Image, Text, View } from 'react-native';
import * as icons from '../../../../assets/icons';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import { halfPadding, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

type Props = {
  value: string;
  onAddInfo: (text: string) => void;
};

export default function ({ value, onAddInfo }: Props) {
  return (
    <View style={{ paddingHorizontal: padding, marginBottom: padding }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: halfPadding }}>
        <Image source={icons.info} />
        <Text style={{ ...texts.default, marginLeft: 4 }}>{t('Informações adicionais')}</Text>
      </View>
      <DefaultInput
        placeholder={t(
          'Tem alguma observação? Por exemplo: sem molho, sem cebola, ponto da carne, etc'
        )}
        multiline
        numberOfLines={6} // How much is enough?
        value={value}
        onChangeText={(text) => onAddInfo(text)}
        style={{ height: 96, marginTop: halfPadding }}
      />
    </View>
  );
}
