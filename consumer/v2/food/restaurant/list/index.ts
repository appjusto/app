import { BusinessAlgolia } from '@appjusto/types';
import { t } from '../../../../../strings';
import { RestaurantListSection } from './types';

export const sectionsFromResults = (items: BusinessAlgolia[] | undefined) => {
  const open = (items ?? []).filter((restaurant) => restaurant.status === 'open');
  const closed = (items ?? []).filter((restaurant) => restaurant.status === 'closed');
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
