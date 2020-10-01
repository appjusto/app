import { Fleet, WithId } from 'appjusto-types';

import { AppDispatch } from '../../app/context';
import Api from '../api/api';
import { awaitWithFeedback } from '../ui/actions';

export const UPDATE_AVAILABLE_FLEETS = 'UPDATE_AVAILABLE_FLEETS';

export const observeFleets = (api: Api) => (dispatch: AppDispatch) => {
  return api.fleet().observeFleets((fleets: WithId<Fleet>[]): void => {
    dispatch({ type: UPDATE_AVAILABLE_FLEETS, payload: fleets });
  });
};

export const createFleet = (api: Api) => (fleet: Partial<Fleet>) => async (
  dispatch: AppDispatch
) => {
  return dispatch(awaitWithFeedback(api.fleet().createFleet(fleet)));
};
