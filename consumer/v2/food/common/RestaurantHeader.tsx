import { Business, WithId } from '@appjusto/types';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import RoundedText from '../../../../common/components/texts/RoundedText';
import { useBusinessCoverImageURI } from '../../../../common/store/api/business/hooks/useBusinessCoverImageURI';
import { useBusinessLogoURI } from '../../../../common/store/api/business/hooks/useBusinessLogoURI';
import { distanceBetweenLatLng } from '../../../../common/store/api/helpers';
import useCuisines from '../../../../common/store/api/platform/hooks/useCuisines';
import { getCurrentLocation } from '../../../../common/store/consumer/selectors';
import { colors, halfPadding, padding, texts } from '../../../../common/styles';
import {
  formatDistance,
  formatDuration,
  separateWithDot,
} from '../../../../common/utils/formatters';
import { t } from '../../../../strings';
import { ListItemImage } from '../restaurant/list/item/ListItemImage';

type Props = {
  restaurant: WithId<Business>;
  onPress?: () => void;
  canNavigate?: boolean;
};

export const RestaurantHeader = ({ restaurant, onPress, canNavigate }: Props) => {
  // redux
  const location = useSelector(getCurrentLocation);
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
  const discount = `-${restaurant.averageDiscount}%`;
  // UI
  const restaurantImageUI = () => {
    if (coverURI) {
      if (restaurant.averageDiscount) {
        return (
          <View>
            <View style={{ borderRadius: halfPadding }}>
              <Image
                source={{ uri: coverURI }}
                style={{
                  height: 120,
                  width: '100%',
                  borderTopLeftRadius: halfPadding,
                  borderTopRightRadius: halfPadding,
                }}
                resizeMode="cover"
              />
              <View
                style={{
                  width: '100%',
                  borderBottomLeftRadius: halfPadding,
                  borderBottomRightRadius: halfPadding,
                  paddingVertical: 12,
                  paddingHorizontal: padding,
                  backgroundColor: colors.darkYellow,
                }}
              >
                <Text style={[texts.sm, texts.bold]}>{t('Preço justo garantido')}</Text>
                <Text style={[texts.xs]}>
                  {t('No AppJusto, os produtos desse restaurante são em média ')}
                  <Text style={[texts.bold]}>{restaurant.averageDiscount}% mais baratos</Text>
                  {t(' comparados a outros apps')}
                </Text>
              </View>
            </View>
            <View style={{ position: 'absolute', left: padding, top: padding }}>
              <RoundedText backgroundColor={colors.darkYellow}>{discount}</RoundedText>
            </View>
          </View>
        );
      } else {
        return (
          <Image
            source={{ uri: coverURI }}
            style={{ height: 120, width: '100%' }}
            borderRadius={8}
            resizeMode="cover"
          />
        );
      }
    } else return null;
  };
  return (
    <View style={{ marginHorizontal: 12 }}>
      <TouchableOpacity onPress={onPress}>
        <View>
          <View style={{ height: 120, width: '100%', borderRadius: 8 }}>{restaurantImageUI()}</View>
          {canNavigate && (
            <View style={{ position: 'absolute', right: halfPadding, bottom: halfPadding }}>
              <RoundedText>{t('Saber mais')}</RoundedText>
            </View>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: coverURI && restaurant.averageDiscount ? 96 : 12,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ width: '78%' }}>
            <Text style={{ ...texts.xl }}>{restaurant.name}</Text>
            <Text style={{ ...texts.xs, color: colors.green600 }}>{cuisine?.name}</Text>
            <Text style={{ ...texts.xs, color: colors.grey700 }}>
              {separateWithDot(formatDistance(distance), formatDuration(averagePreparationTime))}
            </Text>
          </View>
          {logo ? (
            <View>
              <ListItemImage uri={logo} height={64} width={64} />
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    </View>
  );
};
