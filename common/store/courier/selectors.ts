import { createSelector } from 'reselect';

import { State } from '..';

export const getCourierState = (state: State) => state.courier;

export const getCourier = createSelector(getCourierState, (state) => state.courier);

export const getCourierStatus = createSelector(
  getCourier,
  (courier) => courier?.status ?? 'unavailable'
);

export const isCourierWorking = createSelector(
  getCourierStatus,
  (status) => status !== 'unavailable'
);

export const getCourierMode = createSelector(getCourier, (courier) => courier?.mode);

export const getBanks = createSelector(getCourierState, (state) => state.banks);
