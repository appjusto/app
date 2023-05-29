import { Card, IuguCard } from '@appjusto/types';

export const getCardYear = (card: Card) => {
  if (card.processor === 'iugu') {
    return String((card as IuguCard).token?.data.year ?? '');
  }
  return '';
};
