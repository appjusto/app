import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { t } from '../../../../strings';
import DefaultInput from '../../../components/inputs/DefaultInput';
import { halfPadding, padding, texts } from '../../../styles';

type Props = {
  value: string;
  onAddInfo: (text: string) => void;
};

export const OrderAdditionalInfo = ({ value, onAddInfo }: Props) => {
  return (
    <View style={{ paddingHorizontal: padding, marginBottom: padding }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: halfPadding }}>
        <Feather name="info" size={14} />
        <Text style={{ ...texts.sm, marginLeft: 4 }}>{t('Informações adicionais')}</Text>
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
};
