import { AnyAction } from 'redux';

import { UPDATE_AVAILABLE_FLEETS } from './actions';
import { FleetState } from './types';

const initialState: FleetState = {};

export default function (state: FleetState = initialState, action: AnyAction): FleetState {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_AVAILABLE_FLEETS: {
      return { ...state, availableFleets: payload };
    }
    default:
      return state;
  }
}
