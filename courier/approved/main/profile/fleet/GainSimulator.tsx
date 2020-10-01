import React from 'react';
import { View, Text } from 'react-native';

import PaddedView from '../../../../../common/components/containers/PaddedView';
import { colors, screens, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';

export default function () {
  return (
    <View style={{ ...screens.default }}>
      <PaddedView>
        <Text style={{ ...texts.default, marginBottom: 4 }}>{t('Simulação de ganhos')}</Text>
        <Text style={{ ...texts.small, color: colors.darkGrey, marginBottom: 16 }}>
          {t(
            'Veja uma simulação aproximada dos ganhos por corrida nessa frota com os valores definidos acima. Essa simulação não considera a Porcentagem do Valor do Pedido, então os ganhos finais podem ser superiores.'
          )}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <Text style={{ ...texts.default }}>{t('Distância percorrida por entrega')}</Text>
          <Text style={{ ...texts.default, ...texts.bold }}>{t('Ganhos')}</Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ ...texts.default, color: colors.darkGrey }}>3 Km</Text>
          <Text style={{ ...texts.default }}>R$ 00,00</Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ ...texts.default, color: colors.darkGrey }}>5 Km</Text>
          <Text style={{ ...texts.default }}>R$ 00,00</Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ ...texts.default, color: colors.darkGrey }}>7 Km</Text>
          <Text style={{ ...texts.default }}>R$ 00,00</Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ ...texts.default, color: colors.darkGrey }}>9 Km</Text>
          <Text style={{ ...texts.default }}>R$ 00,00</Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ ...texts.default, color: colors.darkGrey }}>11 Km</Text>
          <Text style={{ ...texts.default }}>R$ 00,00</Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ ...texts.default, color: colors.darkGrey }}>13 Km</Text>
          <Text style={{ ...texts.default }}>R$ 00,00</Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ ...texts.default, color: colors.darkGrey }}>15 Km</Text>
          <Text style={{ ...texts.default }}>R$ 00,00</Text>
        </View>
      </PaddedView>
    </View>
  );
}
