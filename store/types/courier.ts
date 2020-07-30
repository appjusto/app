import { Coordinates } from '../types';

export enum CourierStatus {
  Unavailable = 'unavailable',
  Available = 'available',
  Dispatching = 'dispatching',
}

export interface Courier {
  status: CourierStatus;
  location?: Coordinates;
  notificationToken?: string;
}

export interface CourierState {
  email?: string;
  courier?: Courier;
  order?: object;
  availableCouriers: object[];
}
