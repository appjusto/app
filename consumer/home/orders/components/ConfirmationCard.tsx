import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { borders, colors, halfPadding, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

type Props = {
  onPress: () => void;
};

export const ConfirmationCard = ({ onPress }: Props) => {
  return (
    <View
      style={{
        ...borders.default,
        height: 104,
        width: '100%',
        backgroundColor: colors.white,
        borderColor: colors.black,
        justifyContent: 'center',
        paddingHorizontal: 12,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Feather name="check" size={16} />
        <Text style={[{ ...texts.xs }, { ...texts.bold, marginLeft: padding }]}>
          {t('Código de confirmação')}
        </Text>
      </View>
      <View style={{ marginLeft: 40 }}>
        <Text style={{ ...texts.xs }}>
          {t('Ao receber o pedido, informe os 3 primeiros dígitos do seu CPF para o entregador')}
        </Text>
        <TouchableOpacity onPress={onPress} style={{ marginTop: halfPadding }}>
          <Text style={{ ...texts.xs, color: colors.green600 }}>{t('Ok, entendi')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
