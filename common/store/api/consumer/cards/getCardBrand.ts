import { Card, IuguCard } from '@appjusto/types';

export const getCardBrand = (card: Card) => {
  if (card.processor === 'iugu') {
    return (card as IuguCard).token?.data.brand ?? '';
  } else if (card.processor === 'vr') {
    return 'VR';
  }
  return '';
};
