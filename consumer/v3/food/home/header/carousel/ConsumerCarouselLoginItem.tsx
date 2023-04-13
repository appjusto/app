import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { getConsumer } from '../../../../../../common/store/consumer/selectors';
import { doublePadding, halfPadding } from '../../../../../../common/styles';
import { borderRadius2 } from '../../../../common/styles/borders';
import { colors } from '../../../../common/styles/colors';
import { texts } from '../../../../common/styles/fonts';
import { padding4, padding5 } from '../../../../common/styles/padding';

export const ConsumerCarouselLoginItem = () => {
  // redux store
  const consumer = useSelector(getConsumer);
  if (consumer) return null;
  // UI
  return (
    <View
      style={{
        padding: padding5,
        backgroundColor: colors.green700,
        width: 280,
        borderRadius: borderRadius2,
        marginLeft: padding4,
      }}
    >
      <Text style={{ ...texts.md, color: colors.green500 }}>Acesse sua conta</Text>
      <Text style={{ ...texts.md, marginTop: padding4, color: colors.white }}>
        Você precisa estar logado para fazer um pedido
      </Text>
      <View style={{ marginTop: doublePadding, flexDirection: 'row', alignItems: 'flex-end' }}>
        <Text style={{ ...texts.x2s, color: colors.white }}>ENTRAR</Text>
        <Feather
          style={{ marginLeft: halfPadding }}
          size={12}
          color={colors.white}
          name="arrow-right"
        />
      </View>
    </View>
  );
};
