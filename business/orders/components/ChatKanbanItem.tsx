import React from 'react';
import { Text, View } from 'react-native';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import RoundedText from '../../../common/components/texts/RoundedText';
import { borders, colors, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

export const ChatKanbanItem = () => {
  return (
    <View
      style={{
        paddingVertical: 12,
        paddingHorizontal: padding,
        ...borders.default,
        backgroundColor: colors.white,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <RoundedText backgroundColor={colors.grey50} color={colors.black} noBorder>
          Flavor
        </RoundedText>
        <Text style={{ ...texts.x2s }}>ENVIADO ÀS 00h00</Text>
      </View>
      <View style={{ marginVertical: padding }}>
        <Text style={{ ...texts.sm }}>Nome Sobrenome</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ width: '38%' }}>
          <DefaultButton secondary title={t('Ver pedido')} onPress={() => null} />
        </View>
        <View style={{ width: '57%' }}>
          {/* while there is no new message in an ongoing chat, this button will look like a "disabled" one */}
          <DefaultButton title={t('Nova mensagem')} onPress={() => null} />
        </View>
      </View>
    </View>
  );
};
