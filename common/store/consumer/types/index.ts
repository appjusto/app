import { ConsumerProfile, LatLng, WithId } from 'appjusto-types';

export interface ConsumerState {
  consumer?: WithId<ConsumerProfile>;
  currentAddress?: string;
  currentLocation?: LatLng;
}
