import { BusinessAlgolia } from '@appjusto/types';
import { capitalize } from 'lodash';
import React from 'react';
import { Text, View } from 'react-native';
import { useBusinessLogoURI } from '../../../../../common/store/api/business/hooks/useBusinessLogoURI';
import { getNextAvailableDate } from '../../../../../common/store/api/business/selectors';
import { colors, halfPadding, padding, texts } from '../../../../../common/styles';
import { formatDistance, formatHour } from '../../../../../common/utils/formatters';
import { useServerTime } from '../../../../../common/utils/platform/useServerTime';
import { t } from '../../../../../strings';
import { borderRadius2 } from '../../../../v3/common/styles/borders';
import { ItemTag } from './item/ItemTag';
import { ListItemImage } from './ListItemImage';

type Props = {
  id: string;
  restaurant: BusinessAlgolia;
  cuisine: string | undefined;
  distance: number | undefined;
};

export const RestaurantListItem = ({ id, restaurant, cuisine, distance }: Props) => {
  // context
  const now = useServerTime();
  // state
  const { data: logo } = useBusinessLogoURI(id);
  const [day, hour] = getNextAvailableDate(restaurant.schedules, now()) ?? [];
  // UI
  const RestaurantTag = (() => {
    if (restaurant.status === 'unavailable') {
      return <ItemTag text="Temporariamente fechado" variant="yellow" />;
    }
    if ((restaurant.deliveryRange ?? 0) < (distance ?? 0)) {
      return <ItemTag text="Fora do raio de entrega" variant="light-red" />;
    }
    if (!restaurant.opened && day && hour) {
      return <ItemTag text={`Abre ${capitalize(day)} às ${formatHour(hour)}`} />;
    }
    return null;
  })();
  const discount = `${restaurant.averageDiscount}%`;
  return (
    <View
      style={{
        backgroundColor: colors.grey50,
        borderRadius: borderRadius2,
        paddingVertical: halfPadding,
        paddingHorizontal: padding,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: '75%' }}>
              <Text style={{ ...texts.sm }} numberOfLines={2}>{`${restaurant.name}`}</Text>
            </View>
          </View>
          <Text style={{ marginTop: 4, ...texts.xs, color: colors.green700 }}>
            {t(cuisine ?? '')}
          </Text>
          {distance ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Text style={{ ...texts.xs, color: colors.grey700 }}>{`${formatDistance(
                distance
              )} \u00B7`}</Text>
              {RestaurantTag}
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
          <View>
            <ListItemImage uri={logo} height={80} width={80} borderRadius={80} />
            {restaurant.averageDiscount ? (
              <View style={{ position: 'absolute', alignSelf: 'flex-end' }}>
                <View
                  style={{
                    borderRadius: 32,
                    paddingHorizontal: 8,
                    paddingVertical: 12,
                    top: -2,
                    left: 10,
                    backgroundColor: colors.green500,
                  }}
                >
                  <Text style={{ ...texts.x2s, ...texts.bold }}>{discount}</Text>
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};
