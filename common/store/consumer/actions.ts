import { LatLng, Place } from 'appjusto-types';
import { AppDispatch } from '../../app/context';
import { SearchKind, SearchParam } from './types';

export const UPDATE_CURRENT_LOCATION = 'UPDATE_CURRENT_LOCATION';
export const UPDATE_CURRENT_PLACE = 'UPDATE_CURRENT_PLACE';
export const UPDATE_SEARCH_KIND = 'UPDATE_SEARCH_KIND';
export const ADD_RESTAURANT_SEARCH_PARAM = 'ADD_RESTAURANT_SEARCH_PARAM';
export const ADD_PRODUCT_SEARCH_PARAM = 'ADD_PRODUCT_SEARCH_PARAM';
export const REMOVE_RESTAURANT_SEARCH_PARAM = 'REMOVE_RESTAURANT_SEARCH_PARAM';
export const REMOVE_PRODUCT_SEARCH_PARAM = 'REMOVE_PRODUCT_SEARCH_PARAM';

export const updateCurrentLocation = (location: LatLng | undefined) => (dispatch: AppDispatch) => {
  dispatch({ type: UPDATE_CURRENT_LOCATION, payload: location });
};

export const updateCurrentPlace = (place: Place) => (dispatch: AppDispatch) => {
  dispatch({ type: UPDATE_CURRENT_PLACE, payload: place });
};

export const updateSearchKind = (kind: SearchKind) => (dispatch: AppDispatch) => {
  dispatch({ type: UPDATE_SEARCH_KIND, payload: kind });
};

export const addRestaurantSearchParam = (param: SearchParam) => (dispatch: AppDispatch) => {
  dispatch({ type: ADD_RESTAURANT_SEARCH_PARAM, payload: param });
};

export const removeRestaurantSearchParam = (param: SearchParam) => (dispatch: AppDispatch) => {
  dispatch({ type: REMOVE_RESTAURANT_SEARCH_PARAM, payload: param });
};

export const addProductSearchParam = (param: SearchParam) => (dispatch: AppDispatch) => {
  dispatch({ type: ADD_PRODUCT_SEARCH_PARAM, payload: param });
};

export const removeProductSearchParam = (param: SearchParam) => (dispatch: AppDispatch) => {
  dispatch({ type: REMOVE_PRODUCT_SEARCH_PARAM, payload: param });
};
