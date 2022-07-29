import { Business, WithId } from '@appjusto/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Share, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { useBusinessMenuMessage } from '../../../../../common/store/api/business/hooks/useBusinessMenuMessage';
import { borders, colors, halfPadding, padding, texts } from '../../../../../common/styles';
import { getExtra } from '../../../../../common/utils/config';
import { getBaseDomain } from '../../../../../common/utils/domains';
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
  // redux
  const extra = useSelector(getExtra);
  // helpers
  const businessDeeplink = `https://${getBaseDomain(extra.environment)}/r/${
    restaurant?.slug ?? restaurant?.code
  }`;
  const scheduledOrdersOnly =
    restaurant.preparationModes?.length && !restaurant?.preparationModes?.includes('realtime');
  // handlers
  const shareRestaurantHandler = async () => {
    try {
      Share.share({
        message: `Pedi em ${
          restaurant!.name
        } usando o AppJusto, uma plataforma de delivery mais justa para clientes, entregadores e restaurantes. Peça também e faça parte desse movimento: ${businessDeeplink}`,
        title: 'AppJusto',
        url: businessDeeplink,
      });
    } catch (error) {}
  };
  // UI
  return (
    <View>
      <RestaurantHeader restaurant={restaurant} onPress={onAboutPress} canNavigate />
      <TouchableOpacity
        style={{ paddingHorizontal: 12, paddingTop: 12 }}
        onPress={shareRestaurantHandler}
      >
        <PaddedView
          half
          style={{
            flexDirection: 'row',
            backgroundColor: colors.grey50,
            ...borders.default,
            borderColor: colors.grey50,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              marginRight: halfPadding,
              backgroundColor: colors.green500,
              height: 24,
              width: 24,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="share-social-outline" size={14} />
          </View>
          <Text style={{ ...texts.xs }}>{t('Compartilhe esse restaurante com seus amigos!')}</Text>
        </PaddedView>
      </TouchableOpacity>
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
