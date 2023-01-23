import { Business, BusinessAlgolia, LatLng, WithId } from '@appjusto/types';
import { uniqBy } from 'lodash';
import { isAvailable } from '../../../../../common/store/api/business/selectors';
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
  // abertos = dentro do horário de atendimento
  // lista 1: "Disponíveis"
  //          - (primeiro) restaurantes abertos que entregam realtime
  //          - (depois dos realtime) restaurantes fechados que entregam agendados (Tag: abre às "13h")
  // lista 2: "Indisponíveis"
  //          - restaurantes fechados que não entregam agendados (Tag: abre às "13h")
  //          - restaurantes fora da área de entrega
  //          - restaurantes indisponíveis (unavailable)
  const open: (BusinessAlgolia | WithId<Business>)[] = [];
  const scheduledOnly: (BusinessAlgolia | WithId<Business>)[] = [];
  const closed: (BusinessAlgolia | WithId<Business>)[] = [];
  uniqBy(items, (item) => ('id' in item ? item.id : item.objectID)).forEach((item) => {
    if (
      item.status === 'available' &&
      isAvailable(item.schedules, new Date()) &&
      item.preparationModes?.includes('realtime')
    ) {
      open.push(item);
    } else if (item.preparationModes?.includes('scheduled')) {
      scheduledOnly.push(item);
    } else {
      closed.push(item);
    }
  });
  open.push(...scheduledOnly);
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
        subtitle: t('Fora do horário de funcionamento'),
        data: closed,
      },
    ];
  }
  return sections;
};
