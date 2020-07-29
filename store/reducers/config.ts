import { AnyAction } from 'redux';

import * as actionTypes from '../actionTypes';
import { ConfigState } from '../types/config';

export default function (initialState: ConfigState) {
  return (state = initialState, action: AnyAction) => {
    const { type, payload } = action;
    if (state.env === 'development') console.log(type);
    switch (type) {
      case actionTypes.CONFIG_SET_FLAVOR: {
        return { ...state, flavor: payload };
      }
      default:
        return state;
    }
  };
}
