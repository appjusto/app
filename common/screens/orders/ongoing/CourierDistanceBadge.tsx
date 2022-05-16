import { Order } from '@appjusto/types';
import React from 'react';
import { t } from '../../../../strings';
import RoundedText from '../../../components/texts/RoundedText';
import * as helpers from '../../../store/api/order/helpers';
import { colors } from '../../../styles';
import { formatDistance, formatDuration, separateWithDot } from '../../../utils/formatters';

interface Props {
  order: Order;
  delivering?: boolean;
}

export const CourierDistanceBadge = ({ order, delivering }: Props) => {
  const { route, courier, dispatchingState, dispatchingStatus } = order;
  if (!route || !courier) return null;
  const distance = helpers.courierDistanceFromNextPlace(order);
  let text = '';
  if (
    !dispatchingState ||
    dispatchingState === 'going-pickup' ||
    dispatchingState === 'going-destination'
  ) {
    text = separateWithDot(formatDistance(distance), formatDuration(route.duration!));
    // text = formatDistance(distance);
  } else if (dispatchingState === 'arrived-pickup' || dispatchingState === 'arrived-destination') {
    if (dispatchingStatus !== 'outsourced') text = t('Entregador/a no local');
  }
  return (
    <RoundedText
      backgroundColor={delivering ? colors.grey50 : colors.white}
      noBorder={delivering}
      color={delivering ? colors.grey700 : colors.black}
    >
      {text}
    </RoundedText>
  );
};
