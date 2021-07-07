import React from 'react';
import { Text, View } from 'react-native';
import { IconSemaphoreSmall } from '../../../../common/icons/icon-semaphore-small';
import { borders, colors, halfPadding, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

export const RouteIssueCard = () => {
  return (
    <View
      style={{
        ...borders.default,
        paddingHorizontal: padding,
        alignItems: 'center',
        paddingTop: 24,
        paddingBottom: padding,
        backgroundColor: colors.grey50,
      }}
    >
      <IconSemaphoreSmall />
      <Text style={{ ...texts.sm, marginTop: halfPadding }}>{t('Problemas no endereço')}</Text>
      <Text style={{ ...texts.xs, color: colors.grey700 }}>
        {t(
          'Verificamos que o endereço de retirada está igual ao endereço de entrega. Por favor, modifique o endereço para selecionar a frota.'
        )}
      </Text>
    </View>
  );
};
