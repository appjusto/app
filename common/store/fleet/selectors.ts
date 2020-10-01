import { State } from '..';
import { FleetState } from './types';

export const getFleetState = (state: State): FleetState => state.fleet;

export const getAvailableFleets = (state: State) => getFleetState(state).availableFleets;
