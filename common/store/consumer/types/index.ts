import { ConsumerProfile, LatLng, Place, WithId } from 'appjusto-types';

export interface ConsumerState {
  consumer?: WithId<ConsumerProfile>;
  currentPlace?: Place;
  currentLocation?: LatLng;
}
