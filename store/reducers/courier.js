import * as actionTypes from '../actionTypes';
import { COURIER_STATUS_UNAVAILABLE } from '../constants';

const initialState = {
  profile: { id: 'courier-1' },
  location: null,
  status: COURIER_STATUS_UNAVAILABLE,
  availableCouriers: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.SET_COURIER_PROFILE:
    case actionTypes.COURIER_PROFILE_UPDATED: {
      return { ...state, profile: payload };
    }
    case actionTypes.SET_LOCATION: {
      return { ...state, location: payload.coords };
    }    
    case actionTypes.AVAILABLE_COURIERS_UPDATED: {
      return { ...state, availableCouriers: payload };
    }
    default:
      return state;
  }
  
}
