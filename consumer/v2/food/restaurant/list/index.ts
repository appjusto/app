import { Business, BusinessAlgolia, LatLng, WithId } from '@appjusto/types';
import { distanceBetweenLatLng } from '../../../../../common/store/api/helpers';
import { t } from '../../../../../strings';
import { RestaurantListSection } from './types';

//order restaurants depending on wether distance is inside restaurant delivery range
const restaurantsInRange = (
  status: string,
  items?: (BusinessAlgolia | WithId<Business>)[],
  currentLocation?: LatLng | null
) => {
  const inRange = (items ?? []).filter(
    (restaurant) =>
      restaurant.status === status &&
      (restaurant.deliveryRange ?? 0) >=
        (currentLocation && restaurant.businessAddress?.latlng
          ? distanceBetweenLatLng(currentLocation, restaurant.businessAddress.latlng)
          : 0)
  );
  const outOfRange = (items ?? []).filter(
    (restaurant) =>
      restaurant.status === status &&
      (restaurant.deliveryRange ?? 0) <
        (currentLocation && restaurant.businessAddress?.latlng
          ? distanceBetweenLatLng(currentLocation, restaurant.businessAddress.latlng)
          : 0)
  );
  return inRange.concat(outOfRange);
};

export const sectionsFromResults = (
  items?: (BusinessAlgolia | WithId<Business>)[],
  currentLocation?: LatLng | null
) => {
  const open = restaurantsInRange('open', items, currentLocation);
  const closed = restaurantsInRange('closed', items, currentLocation);
  let sections: RestaurantListSection[] = [];
  if (open.length > 0) {
    sections = [
      {
        title: t('Restaurantes abertos agora'),
        subtitle: t('Valor justo para restaurantes e entregadores/as'),
        data: open,
      },
    ];
  }
  if (closed.length > 0) {
    sections = [
      ...sections,
      {
        title: t('Fechados no momento'),
        subtitle: t('Fora do horário de funcionamento'),
        data: closed,
      },
    ];
  }
  return sections;
};
