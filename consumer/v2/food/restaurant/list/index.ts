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
  // const outOfRange: BusinessAlgolia[] = [];
  const closed: BusinessAlgolia[] = [];
  uniqBy(items, (item) => item.objectID).forEach((item) => {
    if (item.opened) {
      if (!isOutOfRange(item, currentLocation)) {
        open.push(item);
      } else {
        // outOfRange.push(item);
        closed.push(item);
      }
    } else {
      closed.push(item);
    }
  });
  let sections: RestaurantListSection[] = [];
  if (open.length > 0) {
    sections = [
      {
        title: t('Restaurantes abertos'),
        subtitle: t('Peça agora ou agende seu pedido'),
        data: open,
      },
    ];
  }
  // if (outOfRange.length > 0) {
  //   sections = [
  //     {
  //       title: t('Fora da área de entrega'),
  //       subtitle: t('Abertos mas não entregam no seu endereço'),
  //       data: outOfRange,
  //     },
  //   ];
  // }
  if (closed.length > 0) {
    sections = [
      ...sections,
      {
        title: t('Restaurantes indisponíveis'),
        subtitle: t('Fora da área de entrega ou fechados no momento'),
        data: closed,
      },
    ];
  }
  return sections;
};
