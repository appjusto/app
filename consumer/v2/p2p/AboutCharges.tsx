import React from 'react';
import { Text } from 'react-native';
import PaddedView from '../../../common/components/containers/PaddedView';
import { useSegmentScreen } from '../../../common/store/api/track';
import { colors, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';

export const AboutCharges = () => {
  // tracking
  useSegmentScreen('AboutCharges');
  return (
    <PaddedView style={{ ...screens.config }}>
      <Text style={{ ...texts.x2l, marginBottom: 24 }}>
        {t(
          'O AppJusto divide o valor dos pedidos para entrega imediata em duas cobranças no seu cartão'
        )}
      </Text>
      <Text style={{ ...texts.x2l, marginBottom: 24 }}>
        {t('Nos pedidos pagos com Pix ou agendados será realizada apenas uma cobrança.')}
      </Text>
      <Text style={{ ...texts.sm, color: colors.grey700, marginBottom: 24 }}>
        {t(
          'Para sermos mais transparentes com nossos parceiros, o AppJusto cobra o valor total do pedido dividido em duas cobranças no cartão. Por exemplo, se o seu pedido é no valor de R$ 10, vamos gerar duas cobranças que, somadas, totalizarão R$ 10.'
        )}
      </Text>
      <Text style={{ ...texts.sm, color: colors.grey700 }}>
        {t(
          'Cada uma dessas cobranças vai pra uma conta específica, facilitando a divisão entre restaurantes e entregadores/as, e possibilitando sermos mais justos em relação aos valores cobrados.'
        )}
      </Text>
    </PaddedView>
  );
};
