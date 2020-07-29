import { State } from '..';
import { CourierState, Courier, CourierStatus } from '../types/courier';

export const getCourierState = (state: State): CourierState => state.courier;

export const getCourier = (state: State): Courier | undefined => getCourierState(state).courier;

export const getCourierStatus = (state: State): CourierStatus =>
  getCourier(state)?.status ?? CourierStatus.Unavailable;

export const isCourierWorking = (state: State) =>
  getCourierStatus(state) !== CourierStatus.Unavailable;

export const getCourierLocation = (state: State) => getCourier(state)?.location;
export const getAvailableCouriers = (state: State) => getCourierState(state).availableCouriers;
