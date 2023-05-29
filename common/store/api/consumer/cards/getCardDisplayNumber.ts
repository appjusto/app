import { Card, IuguCard } from '@appjusto/types';

export const getCardDisplayNumber = (card: Card) => {
  if (card.processor === 'iugu') {
    return (card as IuguCard).token?.data.display_number ?? '';
  }
  return '';
};
