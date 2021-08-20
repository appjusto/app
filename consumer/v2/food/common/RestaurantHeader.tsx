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
import { colors, halfPadding, texts } from '../../../../common/styles';
import {
  formatDistance,
  formatDuration,
  separateWithDot,
} from '../../../../common/utils/formatters';
import { t } from '../../../../strings';
import { ListItemImage } from '../restaurant/list/ListItemImage';

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
  // UI
  return (
    <View style={{ marginHorizontal: 12 }}>
      <TouchableOpacity onPress={onPress}>
        <View>
          <View style={{ height: 120, width: '100%', borderRadius: 8 }}>
            {coverURI && (
              <Image
                source={{ uri: coverURI }}
                style={{ height: 120, width: '100%' }}
                borderRadius={8}
                resizeMode="cover"
              />
            )}
          </View>
          {canNavigate && (
            <View style={{ position: 'absolute', right: halfPadding, bottom: halfPadding }}>
              <RoundedText>{t('Saber mais')}</RoundedText>
            </View>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 12,
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
          <View>
            <ListItemImage uri={logo} height={64} width={64} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
