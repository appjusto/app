import * as actionTypes from '../actionTypes';

export default function (flavor, extra) {
  const initialState = {
    flavor,
    extra,
    env: __DEV__ ? 'development' : 'production',
  };
  return (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
      case actionTypes.CONFIG_SET_FLAVOR: {
        return { ...state, flavor: payload }
      }
      default:
        return state;
    }
  } 
}
