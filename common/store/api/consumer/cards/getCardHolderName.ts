import { Card, IuguCard, VRCard } from '@appjusto/types';

export const getCardHolderName = (card: Card) => {
  if (card.processor === 'iugu') {
    return (card as IuguCard).token?.data.holder_name ?? '';
  } else if (card.processor === 'vr') {
    return (card as VRCard).token?.data.holder_name ?? '';
  }
  return '';
};
