import { BusinessProfile, WithDistance, WithId } from '@appjusto/types';
import { t } from '../../../../../strings';
import { RestaurantListSection } from './types';

export const sectionsFromGeosearch = (
  available: WithDistance<WithId<BusinessProfile>>[] = [],
  unavailable: WithDistance<WithId<BusinessProfile>>[] = []
) => {
  let sections: RestaurantListSection[] = [];
  if (available.length > 0) {
    sections = [
      {
        title: t('Restaurantes disponíveis'),
        subtitle: t('Valor justo para restaurantes e entregadores/as'),
        data: available,
      },
    ];
  }
  if (unavailable.length > 0) {
    sections = [
      ...sections,
      {
        title: t('Indisponíveis'),
        subtitle: t('Fora da área de entrega ou fechados'),
        data: unavailable,
      },
    ];
  }
  return sections;
};
