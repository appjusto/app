import { Business, ConsumerProfile, WithId } from '@appjusto/types';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { IconLogin } from '../../../../common/icons/icon-login';
import HomeCard from '../../../../common/screens/home/cards/HomeCard';
import { getCurrentLocation } from '../../../../common/store/consumer/selectors';
import { padding } from '../../../../common/styles';
import { t } from '../../../../strings';

type Props = {
  consumer: WithId<ConsumerProfile> | undefined;
  onLogin: () => void;
  recentRestaurants: WithId<Business>[];
  onSelectRestaurant: (id: string) => void;
};

export const FoodOrderHomeHeader = ({
  consumer,
  onLogin,
  recentRestaurants,
  onSelectRestaurant,
}: Props) => {
  // redux
  const location = useSelector(getCurrentLocation);
  // console.log('HEADER CURRENTLOCATION', location);
  return (
    <View>
      {/* login */}
      {!consumer ? (
        <TouchableOpacity onPress={onLogin} style={{ marginTop: 24, paddingHorizontal: padding }}>
          <HomeCard
            icon={<IconLogin />}
            title={t('Crie uma conta ou faça o login')}
            subtitle={t('Você precisa estar logado para pedir')}
            // grey
          />
        </TouchableOpacity>
      ) : null}
      {/* most recent restaurants */}
    </View>
  );
};
