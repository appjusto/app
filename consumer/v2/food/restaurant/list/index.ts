import { BusinessAlgolia, LatLng } from '@appjusto/types';
import { uniqBy } from 'lodash';
import { distanceBetweenLatLng } from '../../../../../common/store/api/helpers';
import { t } from '../../../../../strings';
import { RestaurantListSection } from './types';

const isOutOfRange = (business: BusinessAlgolia, location?: LatLng | null) =>
  (business.deliveryRange ?? 0) <
  (location && business.businessAddress?.latlng
    ? distanceBetweenLatLng(location, business.businessAddress.latlng)
    : 0);

export const sectionsFromResults = (
  items: BusinessAlgolia[] = [],
  currentLocation?: LatLng | null
) => {
  const open: BusinessAlgolia[] = [];
  const closed: BusinessAlgolia[] = [];
  uniqBy(items, (item) => ('id' in item ? item.id : item.objectID)).forEach((item) => {
    if (item.opened && !isOutOfRange(item, currentLocation)) {
      open.push(item);
    } else {
      closed.push(item);
    }
  });
  let sections: RestaurantListSection[] = [];
  if (open.length > 0) {
    sections = [
      {
        title: t('Restaurantes disponíveis'),
        subtitle: t('Peça agora ou agende seu pedido'),
        data: open,
      },
    ];
  }
  if (closed.length > 0) {
    sections = [
      ...sections,
      {
        title: t('Restaurantes indisponíveis'),
        subtitle: t('Fechados ou fora da área de entrega'),
        data: closed,
      },
    ];
  }
  return sections;
};
