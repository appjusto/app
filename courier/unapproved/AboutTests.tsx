import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, Text } from 'react-native';
import PaddedView from '../../common/components/containers/PaddedView';
import { useSegmentScreen } from '../../common/store/api/track';
import { screens, texts } from '../../common/styles';
import { t } from '../../strings';
import { UnapprovedParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<UnapprovedParamList, 'AboutTests'>;

export const AboutTests = () => {
  // tracking
  useSegmentScreen('AboutTests');
  return (
    <ScrollView
      style={{ ...screens.config }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <PaddedView>
        <Text style={{ ...texts.x2l }}>
          {t('Os cadastros estão abertos para todo o Brasil, mas os testes iniciarão em São Paulo')}
        </Text>
        <Text style={{ ...texts.md, marginTop: 24 }}>
          {t(
            'O AppJusto não terá barreiras por região. Você poderá aceitar corridas em qualquer cidade do Brasil.'
          )}
        </Text>
        <Text style={{ ...texts.md, marginTop: 24 }}>
          {t(
            'No início, concentraremos nossos esforços para gerar pedidos na região central de São Paulo, expandindo para os locais onde houver mais cadastros sucessivamente.'
          )}
        </Text>
        <Text style={{ ...texts.md, marginTop: 24 }}>
          {t(
            'Aprovaremos os cadastros de forma gradativa, à medida que os pedidos forem aumentando.'
          )}
        </Text>
      </PaddedView>
    </ScrollView>
  );
};
