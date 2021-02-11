import { LatLng, Place } from 'appjusto-types';
import { AppDispatch } from '../../app/context';

export const UPDATE_CURRENT_LOCATION = 'UPDATE_CURRENT_LOCATION';
export const UPDATE_CURRENT_PLACE = 'UPDATE_CURRENT_PLACE';

export const updateCurrentLocation = (location: LatLng | undefined) => (dispatch: AppDispatch) => {
  dispatch({ type: UPDATE_CURRENT_LOCATION, payload: location });
};

export const updateCurrentPlace = (place: Place) => (dispatch: AppDispatch) => {
  dispatch({ type: UPDATE_CURRENT_PLACE, payload: place });
};
