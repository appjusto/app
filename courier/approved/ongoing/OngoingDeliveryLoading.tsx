import { DispatchingState } from '@appjusto/types';
import React from 'react';
import { Text, View } from 'react-native';
import { IconLoading } from '../../../common/icons/icon-loading';
import { colors, halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

type Props = {
  dispatchingState: DispatchingState | undefined;
};

export const OngoingDeliveryLoading = ({ dispatchingState }: Props) => {
  if (dispatchingState) return null;
  return (
    <View
      style={{
        paddingHorizontal: padding,
        paddingTop: 24,
        paddingBottom: 36,
        alignItems: 'center',
        backgroundColor: colors.white,
      }}
    >
      <IconLoading />
      <View style={{ alignItems: 'center' }}>
        <Text style={{ ...texts.lg, paddingTop: halfPadding }}>{t('Aguarde um momento')}</Text>
        <Text style={{ ...texts.sm, color: colors.grey700 }}>
          {t('Estamos carregando os dados do pedido')}
        </Text>
      </View>
    </View>
  );
};
