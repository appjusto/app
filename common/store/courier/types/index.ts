import { Bank } from 'appjusto-types';

import Courier from './Courier';

export interface CourierState {
  courier?: Courier;
  order?: object;
  banks?: Bank[];
}
