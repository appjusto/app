import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, Text } from 'react-native';
import PaddedView from '../../common/components/containers/PaddedView';
import { useSegmentScreen } from '../../common/store/api/track';
import { screens, texts } from '../../common/styles';
import { t } from '../../strings';
import { UnapprovedParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<UnapprovedParamList, 'AboutTransparency'>;

export const AboutTransparency = () => {
  // tracking
  useSegmentScreen('AboutTransparency');
  return (
    <ScrollView
      style={{ ...screens.config }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <PaddedView>
        <Text style={{ ...texts.x2l }}>
          {t('O AppJusto acredita na transparência em primeiro lugar')}
        </Text>
        <Text style={{ ...texts.md, marginTop: 24 }}>
          {t(
            'Nas outras plataformas, você recebe sem saber o que foi descontado. No AppJusto, sempre informaremos sobre todas as cobranças.'
          )}
        </Text>
        <Text style={{ ...texts.md, marginTop: 24 }}>
          {t(
            'Quem tem maquininha, sabe que qualquer transação digital tem taxa. A nossa é uma das menores do mercado.'
          )}
        </Text>
        <Text style={{ ...texts.md, marginTop: 24, ...texts.bold }}>{t('Sobre as taxas:')}</Text>
        <Text style={{ ...texts.md, marginTop: 24 }}>
          {t(
            'A taxa financeira é de 2,21% + R$ 0,09 via cartão de crédito, ou 0,99% no Pix. Por exemplo: em uma corridade de R$ 10,00 paga com cartão, você recebe R$ 9,68. Essa diferença não fica pra gente, é o custo da transação na instituição financeira.'
          )}
        </Text>
        <Text style={{ ...texts.md, marginTop: 24 }}>
          {t(
            'Os pagamentos por cartão de crédito serão recebidos em 30 dias e os feitos com Pix no mesmo dia.'
          )}
        </Text>
        <Text style={{ ...texts.md, marginTop: 24 }}>
          {t(
            'Por causa dessa taxa menor e do recebimento rápido, vamos incentivar que os clientes paguem por Pix.'
          )}
        </Text>
        <Text style={{ ...texts.md, marginTop: 24 }}>
          {t('Antecipações dos valores podem ser feitas com uma taxa de 2,5%.')}
        </Text>
        <Text style={{ ...texts.md, marginTop: 24 }}>
          {t(
            'Para transferir para a sua conta, o custo é de R$ 2,00. Em breve, teremos transferências grátis por Pix!'
          )}
        </Text>
      </PaddedView>
    </ScrollView>
  );
};
