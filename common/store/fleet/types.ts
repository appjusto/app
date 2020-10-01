import { Fleet, WithId } from 'appjusto-types';

export interface FleetState {
  availableFleets?: WithId<Fleet>[];
}
