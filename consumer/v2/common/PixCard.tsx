import React from 'react';
import { Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { pix } from '../../../assets/icons';
import PaddedView from '../../../common/components/containers/PaddedView';
import RoundedText from '../../../common/components/texts/RoundedText';
import { borders, colors, halfPadding, texts } from '../../../common/styles';
import { t } from '../../../strings';

type Props = {
  onPixPayment: () => void;
};

export const PixCard = ({ onPixPayment }: Props) => {
  return (
    <TouchableOpacity onPress={onPixPayment}>
      <PaddedView style={{ ...borders.default, height: 136, borderColor: colors.black }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: halfPadding,
          }}
        >
          <Image source={pix} />
          <RoundedText backgroundColor={colors.yellow}>{t('Novo!')}</RoundedText>
        </View>
        <Text style={{ ...texts.sm }}>
          {t(
            'Entregador e restaurante recebem agora, sem precisar esperar até o fim do mês, e você colabora com uma economia justa!'
          )}
        </Text>
      </PaddedView>
    </TouchableOpacity>
  );
};
