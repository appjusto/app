import { Business, BusinessAlgolia, LatLng, WithId } from '@appjusto/types';
import { uniqBy } from 'lodash';
import { distanceBetweenLatLng } from '../../../../../common/store/api/helpers';
import { t } from '../../../../../strings';
import { RestaurantListSection } from './types';

const isOutOfRange = (business: BusinessAlgolia | WithId<Business>, location?: LatLng | null) =>
  (business.deliveryRange ?? 0) <
  (location && business.businessAddress?.latlng
    ? distanceBetweenLatLng(location, business.businessAddress.latlng)
    : 0);

export const sectionsFromResults = (
  items: (BusinessAlgolia | WithId<Business>)[] = [],
  currentLocation?: LatLng | null
) => {
  const open: (BusinessAlgolia | WithId<Business>)[] = [];
  const openOutOfRange: (BusinessAlgolia | WithId<Business>)[] = [];
  const closed: (BusinessAlgolia | WithId<Business>)[] = [];
  uniqBy(items, (item) => ('id' in item ? item.id : item.objectID)).forEach((item) => {
    if (item.status === 'available') {
      if (!isOutOfRange(item, currentLocation)) open.push(item);
      else openOutOfRange.push(item);
    } else {
      closed.push(item);
    }
  });
  let sections: RestaurantListSection[] = [];
  if (open.length > 0) {
    sections = [
      {
        title: t('Restaurantes disponíveis'),
        subtitle: t('Valor justo para restaurantes e entregadores/as'),
        data: open,
      },
    ];
  }
  if (openOutOfRange.length > 0) {
    sections = [...sections, { data: openOutOfRange }];
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
