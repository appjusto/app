import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, Text } from 'react-native';
import PaddedView from '../../common/components/containers/PaddedView';
import { useSegmentScreen } from '../../common/store/api/track';
import { screens, texts } from '../../common/styles';
import { t } from '../../strings';
import { UnapprovedParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<UnapprovedParamList, 'AboutNoScore'>;

export const AboutNoScore = () => {
  // tracking
  useSegmentScreen('About no score');
  return (
    <ScrollView style={{ ...screens.config }} contentContainerStyle={{ flexGrow: 1 }}>
      <PaddedView>
        <Text style={{ ...texts.x2l }}>
          {t('Não bloqueamos de forma automática, e nem temos Score para entregadores/as')}
        </Text>
        <Text style={{ ...texts.md, marginTop: 24 }}>
          {t(
            'Sabemos que os problemas de uma entrega podem ser causados por situações diversas, por isso achamos que um bloqueio automático é injusto.'
          )}
        </Text>
        <Text style={{ ...texts.md, marginTop: 24 }}>
          {t(
            'Sempre haverá uma pessoa real apurando os fatos antes que qualquer medida seja tomada.'
          )}
        </Text>
        <Text style={{ ...texts.md, marginTop: 24 }}>
          {t(
            'No AppJusto também não temos Score: você trabalha da maneira que escolher e aceita os pedidos que desejar.'
          )}
        </Text>
        <Text style={{ ...texts.md, marginTop: 24 }}>{t('Bem melhor, certo?')}</Text>
      </PaddedView>
    </ScrollView>
  );
};
