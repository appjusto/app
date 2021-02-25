import { ConsumerProfile, LatLng, Place, WithId } from 'appjusto-types';

export interface ConsumerState {
  consumer?: WithId<ConsumerProfile>;
  currentPlace?: Place;
  currentLocation?: LatLng;
  searchKind: SearchKind;
  searchOrder: SearchOrder;
  searchFilters: SearchFilter[];
}

export type SearchKind = 'restaurant' | 'product';
export type SearchOrder = 'distance' | 'price' | 'preparation-time' | 'popularity';
export type SearchFilter = {
  type: 'category' | 'classification';
  value: string;
};
