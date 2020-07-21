import * as actionTypes from '../actionTypes';

export default function (initialState) {
  return (state = initialState, action) => {
    const { type, payload } = action;
    if (state.env === 'development') console.log(type);
    switch (type) {
      case actionTypes.CONFIG_SET_FLAVOR: {
        return { ...state, flavor: payload }
      }
      default:
        return state;
    }
  } 
}
