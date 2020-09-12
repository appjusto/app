import { LocationData } from 'expo-location';

import { Fleet } from '../../fleet/types';
import { ProfileInfo, UserProfile } from '../../user/types';
import Courier from './Courier';

export enum CourierStatus {
  Unavailable = 'unavailable',
  Available = 'available',
  Dispatching = 'dispatching',
}

export interface CourierInfo extends ProfileInfo {}

export interface Bank {
  id: string;
  name: string;
}

export interface CourierProfile extends UserProfile {
  info?: CourierInfo;
  status?: CourierStatus;
  bankAccount?: Bank & {
    agency: string;
    account: string;
    digit: string;
  };
  fleet?: Fleet;
}

export interface CourierState {
  courier?: Courier;
  order?: object;
  location?: LocationData;
  banks?: Bank[];
}
