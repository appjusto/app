import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import PaddedView from '../../../common/components/containers/PaddedView';
import { useSegmentScreen } from '../../../common/store/api/track';
import { colors, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';

export const TransportableItems = () => {
  // tracking
  useSegmentScreen('TransportableItems');
  return (
    <ScrollView style={{ ...screens.config }} scrollIndicatorInsets={{ right: 1 }}>
      <PaddedView>
        <View>
          <Text style={{ ...texts.x2l }}>{t('Saiba o que pode ser\n transportado')}</Text>
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
};
