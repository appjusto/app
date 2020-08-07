import { Coordinates } from '../../types';
import { ProfileInfo } from '../../user/types';
import Courier from './Courier';

export enum CourierStatus {
  Unavailable = 'unavailable',
  Available = 'available',
  Dispatching = 'dispatching',
}

export interface CourierInfo extends ProfileInfo {}

export interface CourierState {
  courier?: Courier;
  order?: object;
  location?: Coordinates;
}
