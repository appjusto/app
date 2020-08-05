import { Coordinates } from '../types';
import { ProfileInfo } from '../user/types';

export enum CourierStatus {
  Unavailable = 'unavailable',
  Available = 'available',
  Dispatching = 'dispatching',
}

export interface CourierInfo extends ProfileInfo {}

export interface Courier {
  id: string;
  info?: CourierInfo;
  name?: string;
  status?: CourierStatus;
  location?: Coordinates;
  notificationToken?: string;
}

export interface CourierState {
  courier?: Courier;
  order?: object;
  availableCouriers: object[];
}
