import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import PaddedView from '../../../../common/components/containers/PaddedView';
import { colors, screens, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { OrderNavigatorParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<OrderNavigatorParamList, 'TransportableItems'>;

export default function () {
  return (
    <ScrollView style={{ ...screens.lightGrey }}>
      <PaddedView>
        <View>
          <Text style={{ ...texts.x2l }}>{t('Saiba o que pode ser transportado')}</Text>
        </View>
        <View style={{ marginTop: 24 }}>
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            {t(
              'O AppJusto leva pacotes, documentos, alimentos, e caixas, tudo que couber no baú com a tampa fechada. O baú possui dimensões máximas de 36cm de altura, 42cm de comprimento e 44cm de largura, e pode transportar até 20kg.'
            )}
          </Text>
        </View>
        <View style={{ marginTop: 24 }}>
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            {t('Além disso, existem exceções que não podem ser transportadas. Veja abaixo:')}
          </Text>
        </View>
        <View style={{ marginTop: 24 }}>
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            {t('• Dinheiro, cheques e objetos de valor')}
          </Text>
        </View>
        <View style={{ marginTop: 24 }}>
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            {t('• Objetos e substâncias ilícitas')}
          </Text>
        </View>
        <View style={{ marginTop: 24 }}>
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            {t('• Armas de fogo e munição')}
          </Text>
        </View>
        <View style={{ marginTop: 24 }}>
          <Text style={{ ...texts.sm, color: colors.grey700 }}>{t('• Materiais inflamáveis')}</Text>
        </View>
      </PaddedView>
    </ScrollView>
  );
}
