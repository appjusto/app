import * as actionTypes from '../actionTypes';

const initialState = {
  profile: {
    id: 'PHnyyuBSxV6LQQt149RI', // TODO: remove after auth
  },
  location: null,
  working: false,
  visibleCouriers: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.COURIER_SET_WORKING: {
      return { ...state, working: payload };
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
