import { Card, IuguCard } from '@appjusto/types';

export const getCardMonth = (card: Card) => {
  if (card.processor === 'iugu') {
    return String((card as IuguCard).token?.data.month ?? '');
  }
  return '';
};
