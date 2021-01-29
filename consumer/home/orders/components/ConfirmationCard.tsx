import React from 'react';
import { Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { check } from '../../../../assets/icons';
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
        <Image source={check} />
        <Text style={[{ ...texts.small }, { ...texts.bold, marginLeft: padding }]}>
          {t('Código de confirmação')}
        </Text>
      </View>
      <View style={{ marginLeft: 40 }}>
        <Text style={{ ...texts.small }}>
          {t('Ao receber o pedido, informe os 3 primeiros dígitos do seu CPF para o entregador')}
        </Text>
        <TouchableOpacity onPress={onPress} style={{ marginTop: halfPadding }}>
          <Text style={{ ...texts.small, color: colors.darkGreen }}>{t('Ok, entendi')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
