import { BusinessAlgolia } from '@appjusto/types';

export interface RestaurantListSection {
  title: string;
  subtitle: string;
  available: boolean;
  data: BusinessAlgolia[];
}
