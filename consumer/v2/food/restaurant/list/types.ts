import { Business, BusinessAlgolia, BusinessProfile, WithDistance, WithId } from '@appjusto/types';

export interface RestaurantListSection {
  title?: string;
  subtitle?: string;
  data: (BusinessAlgolia | WithId<Business> | WithDistance<WithId<BusinessProfile>>)[];
}
