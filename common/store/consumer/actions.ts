import { LatLng, Place } from 'appjusto-types';
import { AppDispatch } from '../../app/context';
import { SearchFilter, SearchKind, SearchOrder } from './types';

export const UPDATE_CURRENT_LOCATION = 'UPDATE_CURRENT_LOCATION';
export const UPDATE_CURRENT_PLACE = 'UPDATE_CURRENT_PLACE';
export const UPDATE_SEARCH_KIND = 'UPDATE_SEARCH_KIND';
export const UPDATE_SEARCH_ORDER = 'UPDATE_SEARCH_ORDER';
export const UPDATE_SEARCH_FILTERS = 'UPDATE_SEARCH_FILTERS';

export const updateCurrentLocation = (location: LatLng | undefined) => (dispatch: AppDispatch) => {
  dispatch({ type: UPDATE_CURRENT_LOCATION, payload: location });
};

export const updateCurrentPlace = (place: Place) => (dispatch: AppDispatch) => {
  dispatch({ type: UPDATE_CURRENT_PLACE, payload: place });
};

export const updateSearchKind = (kind: SearchKind) => (dispatch: AppDispatch) => {
  dispatch({ type: UPDATE_SEARCH_KIND, payload: kind });
};

export const updateSearchOrder = (order: SearchOrder) => (dispatch: AppDispatch) => {
  dispatch({ type: UPDATE_SEARCH_ORDER, payload: order });
};

export const updateSearchFilters = (params: SearchFilter[]) => (dispatch: AppDispatch) => {
  dispatch({ type: UPDATE_SEARCH_FILTERS, payload: params });
};
