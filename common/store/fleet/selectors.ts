import { State } from '..';
import { FleetState } from './types';

export const getFleetState = (state: State): FleetState => state.fleet;

export const getAvailableCities = (state: State) => getFleetState(state).availableCities;
export const getAllCities = (state: State) => getFleetState(state).allCities;

export const getApprovedFleets = (state: State) => getFleetState(state).approvedFleets;
