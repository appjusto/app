import { Coordinates } from "../types";

export enum CourierStatus {
  Unavailable = 'unavailable',
  Available = 'available',
  Dispatching = 'dispatching',
}

export interface Courier {
  id: string;
  status: CourierStatus;
  location?: Coordinates;
}

export interface CourierState {
  courier: Courier;
  order: object | null;
  availableCouriers: object[];
}