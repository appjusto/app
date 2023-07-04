import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { IconHomeCourierRequests } from '../../../../../common/icons/icon-home-courier-requests';
import HomeCard from '../../../../../common/screens/home/cards/HomeCard';
import { useObserveActiveRequests } from '../../../../../common/store/api/courier/hooks/useObserveActiveRequests';
import { colors, padding } from '../../../../../common/styles';
import { t } from '../../../../../strings';

interface Props {
  onPress: () => void;
}

export const CourierHomeRequests = ({ onPress }: Props) => {
  const requests = useObserveActiveRequests();
  if (!requests.length) return null;

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ marginBottom: padding }}>
        <HomeCard
          icon={<IconHomeCourierRequests />}
          title={t('Novos pedidos disponíveis')}
          subtitle={t('Existem pedidos que você pode aceitar agora mesmo!')}
          bgColor={colors.yellow}
          borderColor={colors.black}
        />
      </View>
    </TouchableOpacity>
  );
};
