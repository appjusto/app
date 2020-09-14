import { City, Fleet } from 'appjusto-types';

export interface FleetState {
  availableCities?: City[];
  allCities?: City[];
  approvedFleets?: Fleet[];
}
