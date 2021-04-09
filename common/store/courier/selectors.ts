import { createSelector } from 'reselect';
import { State } from '..';

export const getCourierState = (state: State) => state.courier;

export const getCourier = createSelector(getCourierState, (state) => state.courier);

export const getShownLocationDisclosure = createSelector(
  getCourierState,
  (state) => state.shownLocationDisclosure
);
