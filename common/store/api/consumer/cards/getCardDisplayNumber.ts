import { Card, IuguCard } from '@appjusto/types';
import { VRCard } from '../../../../../../types';

export const getCardDisplayNumber = (card: Card) => {
  if (card.processor === 'iugu') {
    return (card as IuguCard).token?.data.display_number ?? '';
  } else if (card.processor === 'vr') {
    return (card as VRCard).token?.data.display_number ?? '';
  }
  return '';
};
