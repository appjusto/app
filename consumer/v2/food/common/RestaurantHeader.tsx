import { Business, WithId } from '@appjusto/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Share, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import RoundedText from '../../../../common/components/texts/RoundedText';
import { useBusinessCoverImageURI } from '../../../../common/store/api/business/hooks/useBusinessCoverImageURI';
import { useBusinessLogoURI } from '../../../../common/store/api/business/hooks/useBusinessLogoURI';
import { distanceBetweenLatLng } from '../../../../common/store/api/helpers';
import useCuisines from '../../../../common/store/api/platform/hooks/useCuisines';
import { getCurrentLocation } from '../../../../common/store/consumer/selectors';
import { biggerPadding, colors, halfPadding, padding, texts } from '../../../../common/styles';
import { getExtra } from '../../../../common/utils/config';
import { getBaseDomain } from '../../../../common/utils/domains';
import {
  formatDistance,
  formatDuration,
  separateWithDot,
} from '../../../../common/utils/formatters';
import { t } from '../../../../strings';
import { AppJustoOnlyIcon } from '../../../v3/food/home/header/carousel/icons/AppJustoOnlyIcon';
import { ListItemImage } from '../restaurant/list/ListItemImage';

type Props = {
  restaurant: WithId<Business>;
  onPress?: () => void;
  canNavigate?: boolean;
};

export const RestaurantHeader = ({ restaurant, onPress, canNavigate }: Props) => {
  // redux
  const location = useSelector(getCurrentLocation);
  const extra = useSelector(getExtra);
  // state
  const cuisines = useCuisines();
  const cuisine = cuisines?.find((c) => c.name === restaurant.cuisine);
  const averagePreparationTime = restaurant.averageCookingTime ?? 0;
  const { data: coverURI } = useBusinessCoverImageURI(restaurant.id);
  const { data: logo } = useBusinessLogoURI(restaurant.id);
  const distance =
    location && restaurant.businessAddress?.latlng
      ? distanceBetweenLatLng(location, restaurant.businessAddress.latlng)
      : 0;
  // helpers
  const averageDiscount =
    restaurant.averageDiscount && !isNaN(restaurant.averageDiscount)
      ? restaurant.averageDiscount
      : 0;
  const appjustoOnly = restaurant.tags?.includes('appjusto-only');
  // handlers
  const businessDeeplink = `https://${getBaseDomain(extra.environment)}/r/${
    restaurant?.slug ?? restaurant?.code
  }`;
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
      {averageDiscount || appjustoOnly ? (
        <View style={{ backgroundColor: colors.green100, padding }}>
          {appjustoOnly ? (
            <View style={{ flexDirection: 'row' }}>
              <AppJustoOnlyIcon
                style={{ transform: [{ scale: 0.65 }], position: 'absolute', top: -3 }}
              />
              <Text style={{ marginLeft: 50, maxWidth: '90%', ...texts.xs, borderWidth: 0 }}>
                Por acreditar em um delivery mais justo, esse restaurante optou por estar{' '}
                <Text style={{ ...texts.bold }}>só no AppJusto.</Text>
              </Text>
            </View>
          ) : null}
          {!appjustoOnly ? (
            <View style={{ flexDirection: 'row', borderWidth: 0 }}>
              <View style={{ flexDirection: 'row', borderWidth: 0, top: 3 }}>
                <View
                  style={{
                    width: 26,
                    height: 26,
                    backgroundColor: colors.green500,
                    borderRadius: 32,
                    position: 'absolute',
                    borderWidth: 0.5,
                  }}
                />
                <Text
                  style={{
                    ...texts.x2s,
                    fontSize: 10,
                    ...texts.bold,
                    top: 5,
                    left: averageDiscount < 10 ? 7 : 5,
                    borderWidth: 0,
                  }}
                >{`${averageDiscount}%`}</Text>
              </View>
              <Text
                style={{ marginLeft: biggerPadding, maxWidth: '90%', ...texts.xs, borderWidth: 0 }}
              >
                Os produtos desse restaurante são, em média
                <Text style={{ ...texts.bold }}>{` ${averageDiscount}% mais baratos `}</Text>
                comparados a outros apps
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}
      {/* cover image */}
      {coverURI ? (
        <View>
          <Image
            source={{ uri: coverURI }}
            style={{
              height: 120,
              left: 0,
            }}
            resizeMode="cover"
          />
          {logo ? (
            <View style={{ position: 'absolute', alignSelf: 'center', left: padding, top: 28 }}>
              <ListItemImage uri={logo} height={64} width={64} />
            </View>
          ) : null}
        </View>
      ) : null}
      {/* share */}
      <TouchableOpacity onPress={shareRestaurantHandler}>
        <View
          style={{
            padding: halfPadding,
            paddingHorizontal: padding,
            flexDirection: 'row',
            backgroundColor: colors.grey50,
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
        </View>
      </TouchableOpacity>
      {/* info */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding }}>
        <View>
          <Text style={{ ...texts.xl }}>{restaurant.name}</Text>
          <Text style={{ ...texts.xs }}>{cuisine?.name}</Text>
          <Text style={{ ...texts.xs, color: colors.grey700 }}>
            {separateWithDot(formatDistance(distance), formatDuration(averagePreparationTime))}
          </Text>
        </View>
        <View style={{ flex: 1 }} />
        {canNavigate ? (
          <TouchableOpacity onPress={onPress}>
            <View style={{ marginRight: padding }}>
              <RoundedText>{t('Saber mais')}</RoundedText>
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};
