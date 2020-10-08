import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import PaddedView from '../../../../common/components/containers/PaddedView';
import { texts, screens, colors, borders } from '../../../../common/styles';
import { t } from '../../../../strings';
import { HomeNavigatorParamList } from '../../types';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList, 'TransportableItems'>;

export default function () {
  return (
    <ScrollView style={{ ...screens.lightGrey }}>
      <PaddedView>
        <View>
          <Text style={{ ...texts.big }}>{t('Saiba o que pode ser transportado')}</Text>
        </View>
        <View style={{ marginTop: 24 }}>
          <Text style={{ ...texts.default, color: colors.darkGrey }}>
            {t(
              'O AppJusto leva pacotes, documentos, alimentos, e caixas, tudo que couber no baú com a tampa fechada. O baú possui dimensões máximas de 36cm de altura, 42cm de comprimento e 44cm de largura, e pode transportar até 20kg.'
            )}
          </Text>
        </View>
        <View style={{ marginTop: 24 }}>
          <Text style={{ ...texts.default, color: colors.darkGrey }}>
            {t('Além disso, existem exceções que não podem ser transportadas. Veja abaixo:')}
          </Text>
        </View>
        <View style={{ marginTop: 24 }}>
          <Text style={{ ...texts.default, color: colors.darkGrey }}>
            {t('• Dinheiro, cheques e objetos de valor')}
          </Text>
        </View>
        <View style={{ marginTop: 24 }}>
          <Text style={{ ...texts.default, color: colors.darkGrey }}>
            {t('• Objetos e substâncias ilícitas')}
          </Text>
        </View>
        <View style={{ marginTop: 24 }}>
          <Text style={{ ...texts.default, color: colors.darkGrey }}>
            {t('• Armas de fogo e munição')}
          </Text>
        </View>
        <View style={{ marginTop: 24 }}>
          <Text style={{ ...texts.default, color: colors.darkGrey }}>
            {t('• Materiais inflamáveis')}
          </Text>
        </View>
      </PaddedView>
    </ScrollView>
  );
}
