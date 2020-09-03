import { AppDispatch } from '../../app/context';

export const SHOW_TOAST = 'SHOW_TOAST';
export const HIDE_TOAST = 'HIDE_TOAST';
export const BUSY = 'BUSY';

export const showToast = (message: string, type: string = 'success', autoHide: boolean = true) => (
  dispatch: AppDispatch
) => {
  dispatch({ type: SHOW_TOAST, payload: { message, type, autoHide } });
};

export const hideToast = () => (dispatch: AppDispatch) => {
  dispatch({ type: HIDE_TOAST });
};
