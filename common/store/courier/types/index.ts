import { CourierProfile, WithId } from 'appjusto-types';

export interface CourierState {
  courier?: WithId<CourierProfile>;
  shownLocationDisclosure: boolean;
}
