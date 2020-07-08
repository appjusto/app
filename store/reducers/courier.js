import * as actionTypes from '../actionTypes';
import { COURIER_STATUS_NOT_WORKING } from '../constants';

const initialState = {
  profile: null,
  location: null,
  status: COURIER_STATUS_NOT_WORKING,
  availableCouriers: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.COURIER_SET_PROFILE:
    case actionTypes.COURIER_PROFILE_UPDATED: {
      console.log(payload);
      return { ...state, profile: payload };
    }
    case actionTypes.SET_COURIER_LOCATION: {
      return { ...state, location: payload.coords };
    }    
    case actionTypes.AVAILABLE_COURIERS_UPDATED: {
      return { ...state, availableCouriers: payload };
    }
    default:
      return state;
  }
  
}
