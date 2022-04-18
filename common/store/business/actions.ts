import { Business, WithId } from '@appjusto/types';
import { AppDispatch } from '../../app/context';
import Api from '../api/api';

export const BUSINESS_UPDATED = 'BUSINESS_UPDATED';

export const observeBusiness = (api: Api) => (id: string) => (dispatch: AppDispatch) => {
  return api.business().observeBusiness(id, (business: WithId<Business>): void => {
    console.log('observeBusiness', business);
    dispatch({ type: BUSINESS_UPDATED, payload: { business } });
  });
};
