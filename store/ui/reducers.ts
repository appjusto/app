import { AnyAction } from 'redux';

import * as actionTypes from '../actionTypes';
import { ToastState, UIState } from './types';

const initialToastState: ToastState = {
  message: null,
};

const initialState: UIState = {
  toast: initialToastState,
};

export default function (state: UIState = initialState, action: AnyAction) {
  switch (action.type) {
    case actionTypes.SHOW_TOAST: {
      return { ...state, toast: action.payload };
    }

    case actionTypes.HIDE_TOAST: {
      return { ...state, toast: initialToastState };
    }

    default:
      return state;
  }
}
