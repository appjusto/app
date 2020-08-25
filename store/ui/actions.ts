import { AppDispatch } from '../../screens/app/context';

export const SHOW_TOAST = 'SHOW_TOAST';
export const HIDE_TOAST = 'HIDE_TOAST';
export const BLOCK_UI = 'BLOCK_UI';

export const showToast = (message: string, type: string = 'success', autoHide: boolean = true) => (
  dispatch: AppDispatch
) => {
  dispatch({ type: SHOW_TOAST, payload: { message, type, autoHide } });
};

export const hideToast = () => (dispatch: AppDispatch) => {
  dispatch({ type: HIDE_TOAST });
};

export const setBlockUI = (value: boolean) => (dispatch: AppDispatch) => {
  dispatch({ type: BLOCK_UI, payload: value });
};
