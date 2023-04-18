import { BusinessAlgolia } from '@appjusto/types';
import { capitalize } from 'lodash';
import React from 'react';
import { Text, View } from 'react-native';
import { useBusinessLogoURI } from '../../../../../common/store/api/business/hooks/useBusinessLogoURI';
import { getNextAvailableDate } from '../../../../../common/store/api/business/selectors';
import { colors, padding, texts } from '../../../../../common/styles';
import { formatDistance, formatHour } from '../../../../../common/utils/formatters';
import { useServerTime } from '../../../../../common/utils/platform/useServerTime';
import { t } from '../../../../../strings';
import { borderRadius1 } from '../../../../v3/common/styles/borders';
import { ListItemImage } from './ListItemImage';
import { ItemBadge } from './item/ItemBadge';
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
  return (
    <View
      style={{
        backgroundColor: colors.white,
        paddingVertical: 8,
        borderBottomColor: colors.grey90,
        borderBottomWidth: 1,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: padding,
          borderWidth: 0,
        }}
      >
        <View style={{ justifyContent: 'center', maxWidth: '65%' }}>
          <View style={{ borderWidth: 0, justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row', borderWidth: 0 }}>
              <Text style={{ ...texts.sm }} numberOfLines={2}>
                {restaurant.name}
              </Text>
              <ItemBadge business={restaurant} />
            </View>
          </View>
          <Text style={{ marginTop: 4, ...texts.xs, color: colors.green700 }}>
            {t(cuisine ?? '')}
          </Text>
          {distance ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Text style={{ ...texts.xs, color: colors.grey700 }}>{formatDistance(distance)}</Text>
              {RestaurantTag}
            </View>
          ) : null}
        </View>
        <View style={{ flex: 1, borderWidth: 0 }} />
        <ListItemImage uri={logo} height={80} width={80} borderRadius={borderRadius1} />
      </View>
    </View>
  );
};
