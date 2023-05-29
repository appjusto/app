import { Card, IuguCard } from '@appjusto/types';

export const getCardHolderName = (card: Card) => {
  if (card.processor === 'iugu') {
    return (card as IuguCard).token?.data.holder_name ?? '';
  }
  return '';
};
