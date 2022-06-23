import { Business, BusinessAlgolia, WithId } from '@appjusto/types';

export interface RestaurantListSection {
  title?: string;
  subtitle?: string;
  data: (BusinessAlgolia | WithId<Business>)[];
}
