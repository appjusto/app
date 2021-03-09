import React from 'react';
import { Text, View } from 'react-native';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { colors, screens, texts } from '../../../../../common/styles';
import { formatCurrency, formatDistance } from '../../../../../common/utils/formatters';
import { t } from '../../../../../strings';

type Props = {
  fee: number;
  distance: number;
  additional: number;
};

export default function ({ fee, distance, additional }: Props) {
  return (
    <View style={{ ...screens.default }}>
      <PaddedView>
        <Text style={{ ...texts.sm, marginBottom: 4 }}>{t('Simulação de ganhos')}</Text>
        <Text style={{ ...texts.xs, color: colors.grey700, marginBottom: 16 }}>
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
          <Text style={{ ...texts.sm }}>{t('Distância percorrida por entrega')}</Text>
          <Text style={{ ...texts.sm, ...texts.bold }}>{t('Ganhos')}</Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            {t('Até')} {formatDistance(distance)}
          </Text>
          <Text style={{ ...texts.sm }}>{formatCurrency(fee)}</Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            {t('De')} {formatDistance(distance)} {t('a')} {formatDistance(distance + 2000)}
          </Text>
          <Text style={{ ...texts.sm }}>
            {t('Até')} {formatCurrency(fee + 2 * additional)}
          </Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            {t('De')} {formatDistance(distance + 2000)} {t('a')} {formatDistance(distance + 4000)}
          </Text>
          <Text style={{ ...texts.sm }}>
            {t('Até')} {formatCurrency(fee + 4 * additional)}
          </Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            {t('De')} {formatDistance(distance + 4000)} {t('a')} {formatDistance(distance + 6000)}
          </Text>
          <Text style={{ ...texts.sm }}>
            {t('Até')} {formatCurrency(fee + 6 * additional)}
          </Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            {t('De')} {formatDistance(distance + 6000)} {t('a')} {formatDistance(distance + 8000)}
          </Text>
          <Text style={{ ...texts.sm }}>
            {t('Até')} {formatCurrency(fee + 8 * additional)}
          </Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            {t('De')} {formatDistance(distance + 8000)} {t('a')} {formatDistance(distance + 10000)}
          </Text>
          <Text style={{ ...texts.sm }}>
            {t('Até')} {formatCurrency(fee + 10 * additional)}
          </Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            {t('De')} {formatDistance(distance + 10000)} {t('a')} {formatDistance(distance + 12000)}
          </Text>
          <Text style={{ ...texts.sm }}>
            {t('Até')} {formatCurrency(fee + 12 * additional)}
          </Text>
        </View>
      </PaddedView>
    </View>
  );
}
