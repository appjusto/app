import React from 'react';
import { Text, View } from 'react-native';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { colors, screens, texts } from '../../../../../common/styles';
import { formatCurrency, formatDistance } from '../../../../../common/utils/formatters';
import { t } from '../../../../../strings';

type Props = {
  fee: number;
  distance: number;
};

//MATH NEEDS TO BE CORRECTED (FEES)

export default function ({ fee, distance }: Props) {
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
            {t('De')} {formatDistance(distance)} {t('até')} {formatDistance(distance + 2000)}
          </Text>
          <Text style={{ ...texts.sm }}>{formatCurrency(fee * 1.66)}</Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            {t('De')} {formatDistance(distance + 2000)} {t('até')} {formatDistance(distance + 4000)}
          </Text>
          <Text style={{ ...texts.sm }}>{formatCurrency(fee * 2.33)}</Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            {t('De')} {formatDistance(distance + 4000)} {t('até')} {formatDistance(distance + 6000)}
          </Text>
          <Text style={{ ...texts.sm }}>{formatCurrency(fee * 3)}</Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            {t('De')} {formatDistance(distance + 6000)} {t('até')} {formatDistance(distance + 8000)}
          </Text>
          <Text style={{ ...texts.sm }}>{formatCurrency(fee * 3.66)}</Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            {t('De')} {formatDistance(distance + 8000)} {t('até')}{' '}
            {formatDistance(distance + 10000)}
          </Text>
          <Text style={{ ...texts.sm }}>{formatCurrency(fee * 4.33)}</Text>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            {t('De')} {formatDistance(distance + 10000)} {t('até')}{' '}
            {formatDistance(distance + 12000)}
          </Text>
          <Text style={{ ...texts.sm }}>{formatCurrency(fee * 5)}</Text>
        </View>
      </PaddedView>
    </View>
  );
}
