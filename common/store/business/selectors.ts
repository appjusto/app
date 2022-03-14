import { createSelector } from 'reselect';
import { State } from '..';

export const getBusinessState = (state: State) => state.business;

export const getBusiness = createSelector(getBusinessState, (state) => state.business);
