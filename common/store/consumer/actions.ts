import { ConsumerProfile, WithId } from 'appjusto-types';
import { IuguCreatePaymentTokenData, IuguCustomerPaymentMethod } from 'appjusto-types/payment/iugu';
import { CancelToken } from 'axios';

import { AppDispatch } from '../../app/context';
import Api from '../api/api';
import { awaitWithFeedback } from '../ui/actions';

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
