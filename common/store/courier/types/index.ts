import { Bank, CourierProfile } from 'appjusto-types';

export interface CourierState {
  courier?: CourierProfile;
  order?: object;
  banks?: Bank[];
}
