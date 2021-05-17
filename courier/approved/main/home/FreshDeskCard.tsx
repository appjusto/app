import React from 'react';
import { TouchableOpacity } from 'react-native';
import { IconFwCourier } from '../../../../common/icons/icon-fw-courier';
import HomeCard from '../../../../common/screens/home/cards/HomeCard';
import { t } from '../../../../strings';

type Props = {
  onPress: () => void;
  onboarding?: boolean;
};

export const FreshDeskCard = ({ onPress, onboarding }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <HomeCard
        icon={<IconFwCourier />}
        title={onboarding ? t('Central de Ajuda') : t('Como funciona o AppJusto')}
        subtitle={
          onboarding
            ? t('Tire suas dúvidas sobre o AppJusto')
            : t('Conheça as vantagens e entenda os benefícios que temos para você')
        }
      />
    </TouchableOpacity>
  );
};
