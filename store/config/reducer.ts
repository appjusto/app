import { AnyAction } from 'redux';

import { CONFIG_SET_FLAVOR } from './actions';
import { ConfigState } from './types';

export default function (initialState: ConfigState) {
  return (state = initialState, action: AnyAction) => {
    const { type, payload } = action;
    if (state.env === 'development') console.log(type);
    switch (type) {
      case CONFIG_SET_FLAVOR: {
        return { ...state, flavor: payload };
      }
      default:
        return state;
    }
  };
}
