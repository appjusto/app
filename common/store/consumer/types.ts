import { ConsumerProfile, LatLng, Place, WithId } from 'appjusto-types';

export interface ConsumerState {
  consumer?: WithId<ConsumerProfile>;
  currentPlace?: Place;
  currentLocation?: LatLng;
  restaurantsSearchParams: SearchParam[];
  productSearchParameters: SearchParam[];
}

export type SearchOrder = {
  type: 'order';
  kind: 'restaurant' | 'product';
  value: 'distance' | 'price' | 'preparation-time';
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
