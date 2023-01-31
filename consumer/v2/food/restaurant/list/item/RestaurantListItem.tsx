import { Business, BusinessAlgolia, WithId } from '@appjusto/types';
import React from 'react';
import { Text, View } from 'react-native';
import RoundedText from '../../../../../../common/components/texts/RoundedText';
import { getBusinessAvailability } from '../../../../../../common/store/api/business/availability/getBusinessAvailability';
import { isDistanceInDeliveryRange } from '../../../../../../common/store/api/business/delivery-range';
import { useBusinessLogoURI } from '../../../../../../common/store/api/business/hooks/useBusinessLogoURI';
import { colors, halfPadding, padding, texts } from '../../../../../../common/styles';
import { formatDistance } from '../../../../../../common/utils/formatters';
import { useServerTime } from '../../../../../../common/utils/platform/useServerTime';
import { t } from '../../../../../../strings';
import { ListItemImage } from './ListItemImage';
import { RestaurantNextAvailableDateLabel } from './RestaurantNextAvailableDateLabel';

type Props = {
  id: string;
  restaurant: BusinessAlgolia | WithId<Business>;
  cuisine: string | undefined;
  distance: number | undefined;
  secondary?: boolean;
};

export const RestaurantListItem = ({ id, restaurant, cuisine, distance, secondary }: Props) => {
  // context
  const now = useServerTime();
  // state
  const { data: logo } = useBusinessLogoURI(id);
  const isInDeliveryRange = isDistanceInDeliveryRange(restaurant, distance);
  const businessAvailability = getBusinessAvailability({ business: restaurant, date: now() });
  const canScheduleOrder = Boolean(restaurant?.preparationModes?.includes('scheduled'));
  const canOnlyScheduleOrders = businessAvailability === 'closed' && canScheduleOrder;
  // UI
  const discount = `-${restaurant.averageDiscount}%`;
  return (
    <View style={{ justifyContent: 'center' }}>
      <View
        style={{
          borderTopColor: secondary ? colors.white : colors.grey50,
          borderTopWidth: 1,
          paddingTop: halfPadding,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          marginLeft: padding,
          marginRight: halfPadding,
          justifyContent: 'space-between',
          paddingTop: halfPadding,
        }}
      >
        <View style={{ justifyContent: 'center', width: '75%' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: '65%' }}>
              <Text style={{ ...texts.sm, marginRight: halfPadding }}>{restaurant.name}</Text>
            </View>
            {restaurant.averageDiscount ? (
              <View>
                <RoundedText backgroundColor={colors.darkYellow} noBorder>
                  {discount}
                </RoundedText>
              </View>
            ) : null}
          </View>
          <Text style={{ ...texts.xs, color: secondary ? colors.grey700 : colors.green600 }}>
            {t(cuisine ?? '')}
          </Text>
          {distance && isInDeliveryRange ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ ...texts.xs, color: secondary ? colors.green600 : colors.grey700 }}>
                {formatDistance(distance)}
              </Text>
              {canOnlyScheduleOrders ? (
                <RestaurantNextAvailableDateLabel business={restaurant} />
              ) : null}
            </View>
          ) : null}
          {restaurant.deliveryRange && !isInDeliveryRange ? (
            <View style={{ marginTop: halfPadding }}>
              <RoundedText backgroundColor={colors.grey50} color={colors.grey700} noBorder>
                {`${t('Fora do raio de entrega de')} ${formatDistance(restaurant.deliveryRange)}`}
              </RoundedText>
            </View>
          ) : null}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <ListItemImage uri={logo} height={80} width={80} />
        </View>
      </View>
    </View>
  );
};
