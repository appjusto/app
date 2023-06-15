import { Card, IuguCard } from '@appjusto/types';
import { VRCard } from '../../../../../../types';

export const getCardType = (card: Card) => {
  if (card.processor === 'iugu') {
    const iuguCard = card as IuguCard;
    return iuguCard.token?.data.brand ?? 'Cartão de crédito';
  } else if (card.processor === 'vr') {
    const vrCard = card as VRCard;
    if (vrCard.type === 'vr-alimentação') {
      return 'VR Alimentação';
    } else if (vrCard.type === 'vr-refeição') {
      return 'VR Refeição';
    }
  }
  return '';
};
