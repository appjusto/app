import { LatLng } from 'appjusto-types';

import { AppDispatch } from '../../app/context';
import Api from '../api/api';
import * as viacep from '../api/externals/viacep';
import { awaitWithFeedback } from '../ui/actions';

export const UPDATE_BANKS = 'UPDATE_BANKS';

export const submitProfile = (api: Api) => async (dispatch: AppDispatch) => {
  return dispatch(awaitWithFeedback(api.courier().submitProfile()));
};

export const fetchTotalCouriersNearby = (api: Api) => (location: LatLng) => async (
  dispatch: AppDispatch
) => {
  return dispatch(awaitWithFeedback(api.courier().fetchTotalCouriersNearby(location)));
};

export const fetchBanks = (api: Api) => async (dispatch: AppDispatch) => {
  const banks = await dispatch(awaitWithFeedback(api.courier().fetchBanks()));
  dispatch({ type: UPDATE_BANKS, payload: banks });
};

export const fetchPostalDetails = (cep: string) => async (dispatch: AppDispatch) =>
  dispatch(awaitWithFeedback(viacep.fetchPostalDetails(cep)));
