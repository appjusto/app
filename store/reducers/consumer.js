import * as actionTypes from '../actionTypes';

const initialState = {
  profile: null,
  location: null,
  ongoingOrders: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.SET_LOCATION: {
      return { ...state, location: payload.coords };
    }  
    default:
      return state;
  }
  
}
