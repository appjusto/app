import * as actionTypes from '../actionTypes';

const initialState = {
  current: null,
  broadcasting: true,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.LOCATION_UPDATE: {
      return { ...state, current: payload.coords };
    }
    case actionTypes.SET_LOCATION_BROADCAST: {
      return { ...state, broadcasting: payload };
    }
    default:
      return state;
  }
  
}
