import React from 'react';
import { Text, View } from 'react-native';
import motocycleJsonLoading from '../../../assets/lottie-icons/motocycle-loading.json';
import { Lottie } from '../../../common/components/icons/Lottie';
import { colors, halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

type Props = {
  visible: boolean;
};

export const OngoingDeliveryLoading = ({ visible }: Props) => {
  if (!visible) return null;
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
      <Lottie animationObject={motocycleJsonLoading} iconStyle={{ width: 100, height: 100 }} />
      <View style={{ alignItems: 'center' }}>
        <Text style={{ ...texts.lg, paddingTop: halfPadding }}>{t('Aguarde um momento')}</Text>
        <Text style={{ ...texts.sm, color: colors.grey700 }}>
          {t('Estamos carregando os dados do pedido')}
        </Text>
      </View>
    </View>
  );
};
