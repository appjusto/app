import { AppDispatch } from '../../app/context';

export const UPDATE_SHOWN_LOCATION_DISCLOSURE = 'UPDATE_SHOWN_LOCATION_DISCLOSURE';

export const updateShownLocationDisclosure = (value: boolean) => (dispatch: AppDispatch) => {
  dispatch({ type: UPDATE_SHOWN_LOCATION_DISCLOSURE, payload: value });
};
