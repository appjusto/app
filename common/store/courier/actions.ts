import { AppDispatch } from '../../app/context';
import Api from '../api/api';
import { awaitWithFeedback } from '../ui/actions';

export const submitProfile = (api: Api) => async (dispatch: AppDispatch) => {
  return dispatch(awaitWithFeedback(api.courier().submitProfile()));
};
