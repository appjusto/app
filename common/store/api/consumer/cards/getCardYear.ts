import { Card, IuguCard, VRCard } from '@appjusto/types';

export const getCardYear = (card: Card) => {
  if (card.processor === 'iugu') {
    return String((card as IuguCard).token?.data.year ?? '');
  } else if (card.processor === 'vr') {
    return String((card as VRCard).token?.data.year ?? '');
  }
  return '';
};
