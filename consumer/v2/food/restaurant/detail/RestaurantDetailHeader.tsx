import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Share, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Business, WithId } from '../../../../../../types';
import PaddedView from '../../../../../common/components/containers/PaddedView';
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
  // redux
  const extra = useSelector(getExtra);
  // helpers
  const businessDeeplink = `https://${getBaseDomain(extra.environment)}/r/${
    restaurant?.slug ?? restaurant?.code
  }`;
  // just for now
  const [showHeaderMessage] = React.useState(true);
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
      {showHeaderMessage ? (
        <TouchableOpacity
          style={{
            paddingHorizontal: padding,
            paddingTop: padding,
          }}
          onPress={onHeaderMessagePress}
        >
          <Text style={{ ...texts.sm }}>{t('Título da mensagem')}</Text>
          <Text
            style={{ ...texts.xs, flexWrap: 'wrap', color: colors.grey700, paddingVertical: 4 }}
            numberOfLines={2}
          >
            {t(
              'Descrição da mensagem que será exibida em até 2 linhas e o restante ficará escondido com reticências como esparamos que o flexWrap faça'
            )}
          </Text>
          <Text style={{ ...texts.sm }}>{t('Ler mais')}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
