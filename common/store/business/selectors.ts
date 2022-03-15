import { createSelector } from 'reselect';
import { State } from '..';
import { BusinessState } from './types';

export const getBusinessState = (state: State): BusinessState => state.business;

export const getManager = createSelector(getBusinessState, (state) => state.manager);
export const getBusiness = createSelector(getBusinessState, (state) => state.business);
