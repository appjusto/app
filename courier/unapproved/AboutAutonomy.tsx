import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, Text } from 'react-native';
import PaddedView from '../../common/components/containers/PaddedView';
import { useSegmentScreen } from '../../common/store/api/track';
import { screens, texts } from '../../common/styles';
import { t } from '../../strings';
import { UnapprovedParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<UnapprovedParamList, 'AboutAutonomy'>;

export const AboutAutonomy = () => {
  // tracking
  useSegmentScreen('AboutAutonomy');
  return (
    <ScrollView
      style={{ ...screens.config }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <PaddedView>
        <Text style={{ ...texts.x2l }}>
          {t(
            'Você pode criar uma frota, participar das frotas que quiser e definir o valor do seu próprio trabalho'
          )}
        </Text>
        <Text style={{ ...texts.md, marginTop: 24 }}>
          {t(
            'No AppJusto você pode definir o valor cobrado pelo seu serviço criando uma frota ou escolhendo aquela que é mais justa para você.'
          )}
        </Text>
        <Text style={{ ...texts.md, marginTop: 24 }}>
          {t(
            'Ao começar, você estará na frota AppJusto, onde sua remuneração será de R$ 10,00 até 5km, com acréscimo de R$ 2,00 por km adicional. Você pode mudar de frota a qualquer momento!'
          )}
        </Text>
        <Text style={{ ...texts.md, marginTop: 24 }}>
          {t(
            'Aqui no AppJusto, não ganhamos nada em cima das entregas: o cliente paga direto para você. Descontamos apenas a taxa financeira.'
          )}
        </Text>
      </PaddedView>
    </ScrollView>
  );
};
