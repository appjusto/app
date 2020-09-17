import { State } from '..';

export const getCourierState = (state: State) => state.courier;

export const getCourier = (state: State) => getCourierState(state).courier;

export const getCourierStatus = (state: State) => getCourier(state)?.status ?? 'unavailable';

export const isCourierWorking = (state: State) => getCourierStatus(state) !== 'unavailable';

export const getBanks = (state: State) => getCourierState(state).banks;
