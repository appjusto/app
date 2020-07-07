import * as actionTypes from '../actionTypes';
import { COURIER_STATUS_NOT_WORKING } from '../constants';

const initialState = {
  profile: null,
  location: null,
  status: COURIER_STATUS_NOT_WORKING,
  visibleCouriers: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.COURIER_SET_PROFILE: {
      return { ...state, profile: payload };
    }
    case actionTypes.COURIER_UPDATE_STATUS: {
      return { ...state, status: payload };
    }
    case actionTypes.COURIER_UPDATE_LOCATION: {
      return { ...state, location: payload.coords };
    }
    case actionTypes.COURIER_UPDATE_VISIBLE_COURIERS: {
      return { ...state, visibleCouriers: payload };
    }
    default:
      return state;
  }
  
}
