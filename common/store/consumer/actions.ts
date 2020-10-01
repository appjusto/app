import { IuguCreatePaymentTokenData } from 'appjusto-types/payment/iugu';
import { CancelToken } from 'axios';

import { AppDispatch } from '../../app/context';
import Api from '../api/api';
import { awaitWithFeedback } from '../ui/actions';

export const saveCard = (api: Api) => (
  tokenData: IuguCreatePaymentTokenData,
  cancelToken?: CancelToken
) => async (dispatch: AppDispatch) => {
  return dispatch(awaitWithFeedback(api.consumer().saveCard(tokenData, cancelToken)));
};
