import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { borders, colors, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

type Props = {
  onPress: () => void;
};

export const CodeInfoBox = ({ onPress }: Props) => {
  return (
    <View
      style={{
        ...borders.default,
        backgroundColor: colors.white,
        flex: 1,
        marginHorizontal: padding,
      }}
    >
      <TouchableOpacity onPress={onPress}>
        <View style={{ flexDirection: 'row', flex: 1, padding: 12 }}>
          <Feather name="check" size={18} />
          <View style={{ marginLeft: padding }}>
            <Text style={[texts.xs, texts.bold]}>{t('Código de confirmação')}</Text>
            <Text style={{ ...texts.xs }}>
              {t(
                'Ao receber o pedido, informe os 3 primeiros dígitos do seu CPF para o/a entregador/a'
              )}
            </Text>
            <Text style={{ ...texts.xs, color: colors.green600 }}>{t('Ok, entendi')}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
