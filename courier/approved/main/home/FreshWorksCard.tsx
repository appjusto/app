import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IconFwCourier } from '../../../../common/icons/icon-fw-courier';
import HomeCard from '../../../../common/screens/home/cards/HomeCard';
import { t } from '../../../../strings';

type Props = {
  onPress: () => void;
};

export const FreshWorksCard = ({ onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <HomeCard
        icon={<IconFwCourier />}
        title={t('Como funciona o AppJusto')}
        subtitle={t('Conheça as vantagens e entenda os benefícios que temos para você')}
      />
    </TouchableOpacity>
  );
};
