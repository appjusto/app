import { Coordinates } from '../types';

export enum CourierStatus {
  Unavailable = 'unavailable',
  Available = 'available',
  Dispatching = 'dispatching',
}

export interface Courier {
  id: string;
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
