import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import PaddedView from '../../../common/components/containers/PaddedView';
import RoundedText from '../../../common/components/texts/RoundedText';
import { IconPixLogo } from '../../../common/icons/icon-pix-logo';
import { borders, colors, halfPadding, texts } from '../../../common/styles';
import { t } from '../../../strings';

type Props = {
  navigateToPixPayment: () => void;
};

export const PixCard = ({ navigateToPixPayment }: Props) => {
  return (
    <TouchableOpacity onPress={navigateToPixPayment}>
      <PaddedView style={{ ...borders.default, height: 136, borderColor: colors.black }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: halfPadding,
          }}
        >
          <IconPixLogo />
          <RoundedText backgroundColor={colors.yellow}>{t('Novo!')}</RoundedText>
        </View>
        <Text style={{ ...texts.sm }}>
          {t(
            'Entregador/a e restaurante recebem agora, sem precisar esperar até o fim do mês, e você colabora com uma economia justa!'
          )}
        </Text>
      </PaddedView>
    </TouchableOpacity>
  );
};
