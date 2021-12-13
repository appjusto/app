import { AppDispatch } from '../../app/context';
import { ToastType } from './types';

export const SHOW_TOAST = 'SHOW_TOAST';
export const HIDE_TOAST = 'HIDE_TOAST';
export const BUSY = 'BUSY';

export const showToast =
  (message: string, type: ToastType = 'success', autoHide: boolean = true, keyboardIsOpen: boolean = false) =>
    (dispatch: AppDispatch) => {
      dispatch({
        type: SHOW_TOAST,
        payload: { message: message.replace('Error: ', ''), type, autoHide, keyboardIsOpen },
      });
    };

export const hideToast = () => (dispatch: AppDispatch) => {
  dispatch({ type: HIDE_TOAST });
};

export const awaitWithFeedback =
  <T>(promise: Promise<T>) =>
    async (dispatch: AppDispatch) => {
      dispatch({ type: BUSY, payload: true });
      try {
        const result = await promise;
        dispatch({ type: BUSY, payload: false });
        return result;
      } catch (error) {
        dispatch({ type: BUSY, payload: false });
        throw error;
      }
    };
