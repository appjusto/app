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

export const awaitWithFeedback = (promise: Promise<any>) => async (dispatch: AppDispatch) => {
  dispatch({ type: BUSY, payload: true });
  try {
    const result = await promise;
    dispatch({ type: BUSY, payload: false });
    return result;
  } catch (error) {
    // console.error(error);
    dispatch({ type: BUSY, payload: false });
    return null;
  }
};
