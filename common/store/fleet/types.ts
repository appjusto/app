import { City, Fleet, WithId } from 'appjusto-types';

export interface FleetState {
  availableCities?: City[];
  allCities?: City[];
  approvedFleets?: WithId<Fleet>[];
}
