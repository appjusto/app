import { AnyAction } from 'redux';

import { UPDATE_AVAILABLE_CITIES, UPDATE_ALL_CITIES, UPDATE_APPROVED_FLEETS } from './actions';
import { FleetState } from './types';

const initialState: FleetState = {};

export default function (state: FleetState = initialState, action: AnyAction): FleetState {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_AVAILABLE_CITIES: {
      return { ...state, availableCities: payload };
    }
    case UPDATE_ALL_CITIES: {
      return { ...state, allCities: payload };
    }
    case UPDATE_APPROVED_FLEETS: {
      return { ...state, approvedFleets: payload };
    }
    default:
      return state;
  }
}
