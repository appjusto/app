import Api from '../api/api';
import { SaveCardPayload } from './types';

export const saveCard = (api: Api) => (card: SaveCardPayload) => {
  return api.consumer().saveCard(card);
};
