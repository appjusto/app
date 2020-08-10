import { AnyAction } from 'redux';

import { HIDE_TOAST, SHOW_TOAST } from './actions';
import { ToastState, UIState } from './types';

const initialToastState: ToastState = {
  message: null,
};

const initialState: UIState = {
  toast: initialToastState,
};

export default function (state: UIState = initialState, action: AnyAction) {
  switch (action.type) {
    case SHOW_TOAST: {
      return { ...state, toast: action.payload };
    }
    case HIDE_TOAST: {
      return { ...state, toast: initialToastState };
    }
    default:
      return state;
  }
}
