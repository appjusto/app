import { Business, WithId } from '@appjusto/types';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { useBusinessMenuMessage } from '../../../../../common/store/api/business/hooks/useBusinessMenuMessage';
import { colors, halfPadding, padding, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { RestaurantHeader } from '../../common/RestaurantHeader';

interface Props {
  restaurant: WithId<Business>;
  onAboutPress: () => void;
  onHeaderMessagePress: () => void;
}

export const RestaurantDetailHeader = ({
  restaurant,
  onAboutPress,
  onHeaderMessagePress,
}: Props) => {
  // context
  const message = useBusinessMenuMessage(restaurant.id);
  // helpers
  const scheduledOrdersOnly =
    restaurant.preparationModes?.length && !restaurant?.preparationModes?.includes('realtime');
  // UI
  return (
    <View>
      <RestaurantHeader restaurant={restaurant} onPress={onAboutPress} canNavigate />
      {scheduledOrdersOnly ? (
        <View style={{ paddingHorizontal: 12, paddingTop: halfPadding }}>
          <PaddedView
            style={{
              height: 74,
              width: '100%',
              borderRadius: halfPadding,
              backgroundColor: colors.darkYellow,
              justifyContent: 'center',
            }}
          >
            <Text style={{ ...texts.sm }}>
              {t('Esse restaurante somente aceita pedidos com horário agendado para entrega')}
            </Text>
          </PaddedView>
        </View>
      ) : null}
      {message ? (
        <TouchableOpacity
          style={{
            paddingHorizontal: padding,
            paddingTop: padding,
          }}
          onPress={onHeaderMessagePress}
        >
          <Text style={{ ...texts.sm }}>{message.title}</Text>
          <Text
            style={{ ...texts.xs, flexWrap: 'wrap', color: colors.grey700, paddingVertical: 4 }}
            numberOfLines={2}
          >
            {message.description}
          </Text>
          <Text style={{ ...texts.sm }}>{t('Ler mais')}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
