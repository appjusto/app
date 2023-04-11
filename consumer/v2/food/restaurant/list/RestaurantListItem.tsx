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
import { borderRadius1 } from '../../../../v3/common/styles/borders';
import { AppJustoOnlyIcon } from '../../../../v3/food/home/header/carousel/icons/AppJustoOnlyIcon';
import { ListItemImage } from './ListItemImage';
import { ItemTag } from './item/ItemTag';

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
  let discount = '';
  if (restaurant.averageDiscount) {
    const padding = restaurant.averageDiscount < 10 ? '  ' : ' ';
    discount = `${padding}${restaurant.averageDiscount}%`;
  }
  return (
    <View
      style={{
        backgroundColor: colors.white,
        paddingVertical: halfPadding,
        borderBottomColor: colors.grey500,
        borderBottomWidth: 1,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: padding,
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
            <ListItemImage uri={logo} height={80} width={80} borderRadius={borderRadius1} />
            {restaurant.averageDiscount ? (
              <View style={{ position: 'absolute', alignSelf: 'flex-start' }}>
                <View
                  style={{
                    borderRadius: 32,
                    paddingHorizontal: 10,
                    paddingVertical: 14,
                    top: -10,
                    left: -36,
                    backgroundColor: colors.green500,
                  }}
                >
                  <Text style={{ ...texts.x2s, ...texts.bold }}>{discount}</Text>
                </View>
              </View>
            ) : null}
            {restaurant.tags?.includes('appjusto-only') ? (
              <View style={{ position: 'absolute', alignSelf: 'flex-start' }}>
                <View
                  style={{
                    borderRadius: 32,
                    top: -10,
                    left: -36,
                    backgroundColor: colors.green500,
                  }}
                >
                  <AppJustoOnlyIcon style={{ transform: [{ scale: 0.8 }] }} />
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};
