import React, { useCallback } from 'react';
import { Share, TouchableOpacity } from 'react-native';

import * as icons from '../../../../assets/icons';
import { t } from '../../../../strings';
import HomeCard from './HomeCard';

export default function () {
  const shareHandler = useCallback(() => {
    try {
      Share.share({
        message: `O AppJusto é um app de entregas open-source que cobra menos dos restaurantes e dá autonomia aos entregadores. Faça parte desse movimento! Saiba mais em: https://appjusto.com.br`,
        title: 'App Justo',
        url: `https://appjusto.com.br`,
      });
    } catch (error) {}
  }, []);

  return (
    <TouchableOpacity onPress={shareHandler}>
      <HomeCard
        icon={icons.share}
        title={t('Divulgue o AppJusto')}
        subtitle={t('Compartilhe esse movimento por uma economia mais justa.')}
      />
    </TouchableOpacity>
  );
}
