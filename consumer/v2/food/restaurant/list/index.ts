import { BusinessAlgolia, LatLng } from '@appjusto/types';
import { uniqBy } from 'lodash';
import { inDeliveryRange } from '../../../../../common/store/api/helpers';
import { t } from '../../../../../strings';
import { RestaurantListSection } from './types';

export const sectionsFromResults = (
  items: BusinessAlgolia[] = [],
  currentLocation?: LatLng | null
) => {
  const available: BusinessAlgolia[] = [];
  // const outOfRange: BusinessAlgolia[] = [];
  const unavailable: BusinessAlgolia[] = [];
  uniqBy(items, (item) => item.objectID).forEach((item) => {
    if (item.opened) {
      if (currentLocation && inDeliveryRange(item, currentLocation)) {
        console.log(item.name, 'opened');
        available.push(item);
      } else {
        // outOfRange.push(item);
        unavailable.push(item);
      }
    } else {
      unavailable.push(item);
    }
  });
  let sections: RestaurantListSection[] = [];
  if (available.length > 0) {
    sections = [
      {
        title: t('Restaurantes abertos'),
        subtitle: t('Peça agora ou agende seu pedido'),
        available: true,
        data: available,
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
  if (unavailable.length > 0) {
    sections = [
      ...sections,
      {
        title: t('Restaurantes indisponíveis'),
        subtitle: t('Fora da área de entrega ou fechados no momento'),
        available: false,
        data: unavailable,
      },
    ];
  }
  return sections;
};
