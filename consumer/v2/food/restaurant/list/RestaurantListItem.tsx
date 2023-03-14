import { Business, BusinessAlgolia, WithId } from '@appjusto/types';
import { capitalize } from 'lodash';
import React from 'react';
import { Text, View } from 'react-native';
import RoundedText from '../../../../../common/components/texts/RoundedText';
import { useBusinessLogoURI } from '../../../../../common/store/api/business/hooks/useBusinessLogoURI';
import {
  getNextAvailableDate,
  isAvailable,
} from '../../../../../common/store/api/business/selectors';
import { colors, halfPadding, padding, texts } from '../../../../../common/styles';
import { formatDistance, formatHour } from '../../../../../common/utils/formatters';
import { useServerTime } from '../../../../../common/utils/platform/useServerTime';
import { t } from '../../../../../strings';
import { borderRadius2 } from '../../../../v3/common/styles/borders';
import { ListItemImage } from './ListItemImage';

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
  const outOfRange = (restaurant.deliveryRange ?? 0) < (distance ?? 0);
  const canOnlyScheduleOrders =
    !isAvailable(restaurant.schedules, now()) && restaurant.preparationModes?.includes('scheduled');
  const [day, hour] = getNextAvailableDate(restaurant.schedules, now()) ?? [];
  // UI
  const discount = `-${restaurant.averageDiscount}%`;
  return (
    <View
      style={{
        justifyContent: 'center',
        backgroundColor: colors.grey50,
        borderRadius: borderRadius2,
      }}
    >
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
          {distance ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ ...texts.xs, color: secondary ? colors.green600 : colors.grey700 }}>
                {formatDistance(distance)}
              </Text>
              {canOnlyScheduleOrders && day && hour ? (
                <View style={{ marginLeft: padding }}>
                  <RoundedText backgroundColor={colors.green100} color={colors.black} noBorder>
                    {`Abre ${capitalize(day)} às ${formatHour(hour)}`}
                  </RoundedText>
                </View>
              ) : null}
            </View>
          ) : null}
          {distance && outOfRange ? (
            <View style={{ marginTop: halfPadding }}>
              <RoundedText backgroundColor={colors.grey50} color={colors.grey700} noBorder>
                {`${t('Fora do raio de entrega de')} ${formatDistance(restaurant.deliveryRange!)}`}
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
