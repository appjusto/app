import { LatLng } from 'appjusto-types';
import { IuguCreatePaymentTokenData } from 'appjusto-types/payment/iugu';
import { CancelToken } from 'axios';
import { AppDispatch } from '../../app/context';
import Api from '../api/api';
import { awaitWithFeedback } from '../ui/actions';

export const UPDATE_CURRENT_LOCATION = 'UPDATE_CURRENT_LOCATION';
export const UPDATE_CURRENT_ADDRESS = 'UPDATE_CURRENT_ADDRESS';

export const updateCurrentLocation = (location: LatLng) => (dispatch: AppDispatch) => {
  dispatch({ type: UPDATE_CURRENT_LOCATION, payload: location });
};

export const updateCurrentAddress = (address: string) => (dispatch: AppDispatch) => {
  dispatch({ type: UPDATE_CURRENT_ADDRESS, payload: address });
};

export const saveCard = (api: Api) => (
  cpf: string,
  tokenData: IuguCreatePaymentTokenData,
  cancelToken?: CancelToken
) => async (dispatch: AppDispatch) => {
  return dispatch(awaitWithFeedback(api.consumer().saveCard(cpf, tokenData, cancelToken)));
};

export const deletePaymentMethod = (api: Api) => (
  consumerId: string,
  paymentMethodId: string
) => async (dispatch: AppDispatch) => {
  return dispatch(
    awaitWithFeedback(api.consumer().deletePaymentMethod(consumerId, paymentMethodId))
  );
};
