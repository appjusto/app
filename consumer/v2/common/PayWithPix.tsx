import React from 'react';
import { Image, Text, View } from 'react-native';
import { pix } from '../../../assets/icons';
import PaddedView from '../../../common/components/containers/PaddedView';
import { padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';

export const PayWithPix = () => {
  return (
    <View style={{ ...screens.config }}>
      <PaddedView>
        <Image source={pix} />
        <Text style={{ ...texts.lg, marginTop: padding }}>{t('Informe sua chave')}</Text>
      </PaddedView>
    </View>
  );
};
