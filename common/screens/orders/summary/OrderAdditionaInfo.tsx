import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { t } from '../../../../strings';
import DefaultInput from '../../../components/inputs/DefaultInput';
import { halfPadding, padding, texts } from '../../../styles';

type Props = {
  value: string;
  onAddInfo: (text: string) => void;
  editable?: boolean;
};

export const OrderAdditionalInfo = ({ value, onAddInfo, editable = true }: Props) => {
  return (
    <View style={{ paddingHorizontal: padding, marginBottom: padding }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: halfPadding }}>
        <Feather name="info" size={14} />
        <Text style={{ ...texts.sm, marginLeft: 4 }}>{t('Informações adicionais')}</Text>
      </View>
      <DefaultInput
        placeholder={t(
          'Tem alguma observação? Por exemplo: sem molho, sem cebola, ponto da carne, etc'
        )}
        multiline
        value={value}
        onChangeText={(text) => onAddInfo(text)}
        style={{ height: 96, marginTop: halfPadding }}
        returnKeyType="done"
        blurOnSubmit
        editable={editable}
      />
    </View>
  );
};
