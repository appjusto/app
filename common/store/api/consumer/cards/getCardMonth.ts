import { Card, IuguCard, VRCard } from '@appjusto/types';

export const getCardMonth = (card: Card) => {
  if (card.processor === 'iugu') {
    return String((card as IuguCard).token?.data.month ?? '');
  } else if (card.processor === 'vr') {
    return String((card as VRCard).token?.data.month ?? '');
  }
  return '';
};
