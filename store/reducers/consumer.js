// import * as actionTypes from '../actionTypes';

const initialState = {
  ongoingOrders: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    default:
      return state;
  }
  
}
