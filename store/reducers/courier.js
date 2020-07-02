import * as actionTypes from '../actionTypes';

const initialState = {
  working: false,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.COURIER_SET_WORKING: {
      return { ...state, working: payload };
    }
    default:
      return state;
  }
  
}
