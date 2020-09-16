import { Bank, CourierProfile, WithId } from 'appjusto-types';

export interface CourierState {
  courier?: WithId<CourierProfile>;
  order?: object;
  banks?: Bank[];
}
