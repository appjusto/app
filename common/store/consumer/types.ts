import { ConsumerProfile, LatLng, Place, WithId } from '@appjusto/types';

export interface ConsumerState {
  consumer?: WithId<ConsumerProfile>;
  currentPlace?: Place;
  currentLocation?: LatLng | null;
  searchKind: SearchKind;
  searchOrder: SearchOrder;
  searchFilters: SearchFilter[];
}

export type SearchKind = 'restaurant' | 'product';
export type SearchOrder =
  | 'distance'
  | 'price'
  | 'preparation-time'
  | 'popularity'
  | 'average-discount'
  | 'reviews';
export type SearchFilter = {
  type: 'cuisine' | 'classification' | 'appjusto-only';
  value: string;
};
