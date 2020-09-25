import Api from '../api/api';
import { CreatePaymentToken } from './types/payment/iugu';

export const saveCard = (api: Api) => (card: CreatePaymentToken) => {
  return api.consumer().saveCard(card);
};
