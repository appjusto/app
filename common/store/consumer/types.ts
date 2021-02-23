import { ConsumerProfile, LatLng, Place, WithId } from 'appjusto-types';

export interface ConsumerState {
  consumer?: WithId<ConsumerProfile>;
  currentPlace?: Place;
  currentLocation?: LatLng;
  restaurantsSearchParams: SearchParam[];
  productSearchParameters: SearchParam[];
  searchKind: SearchKind;
}

export type SearchKind = {
  type: 'kind';
  value: 'restaurant' | 'product';
  title?: string;
};

export type SearchOrder = {
  type: 'order';
  kind: 'restaurant' | 'product';
  value: 'distance' | 'price' | 'preparation-time' | 'popularity';
};

export type SearchCategory = {
  type: 'category';
  kind: 'restaurant';
  value: string;
};
export type SearchRestaurant = SearchOrder | SearchCategory;
export type SearchClassification = {
  type: 'classification';
  kind: 'product';
  value: string;
};
export type SearchProduct = SearchOrder | SearchClassification;
export type SearchParam = SearchRestaurant | SearchProduct;
