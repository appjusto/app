import * as actionTypes from '../actionTypes';

const initialState = {
  current: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOCATION_UPDATE: {
      return {
        current: action.payload.coords,
      };
    }
    default:
      return state;
  }
  
}
