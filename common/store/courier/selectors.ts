import { CourierStatus } from 'appjusto-types';

import { State } from '..';
import { CourierState } from './types';
import Courier from './types/Courier';

export const getCourierState = (state: State): CourierState => state.courier;

export const getCourier = (state: State): Courier | undefined => getCourierState(state).courier;

export const getCourierStatus = (state: State): CourierStatus =>
  getCourier(state)?.status ?? 'unavailable';

export const isCourierWorking = (state: State) => getCourierStatus(state) !== 'unavailable';

export const getBanks = (state: State) => getCourierState(state).banks;
