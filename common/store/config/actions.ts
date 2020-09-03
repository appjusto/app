import { AppDispatch } from '../../app/context';

export const CONFIG_SET_FLAVOR = 'CONFIG_SET_FLAVOR';

export const setFlavor = (value: string) => (dispatch: AppDispatch) => {
  dispatch({ type: CONFIG_SET_FLAVOR, payload: value });
};
