import React, { useCallback } from 'react';
import { Share, TouchableOpacity } from 'react-native';
import { t } from '../../../../strings';
import { AppJustoSiteURL } from '../../../../strings/values';
import { IconShare } from '../../../icons/icon-share';
import HomeCard from './HomeCard';

type Props = {
  title: string;
  subtitle: string;
  isGrey?: boolean;
};

export default function ({ title, subtitle, isGrey }: Props) {
  const shareHandler = useCallback(() => {
    try {
      Share.share({
        message: `O AppJusto é um app de entregas open-source que cobra menos dos restaurantes e dá autonomia a entregadores/as. Faça parte desse movimento! Saiba mais em: ${AppJustoSiteURL}`,
        title: 'AppJusto',
        url: AppJustoSiteURL,
      });
    } catch (error) {}
  }, []);

  return (
    <TouchableOpacity onPress={shareHandler}>
      <HomeCard icon={<IconShare />} title={t(title)} subtitle={t(subtitle)} grey={isGrey} />
    </TouchableOpacity>
  );
}
