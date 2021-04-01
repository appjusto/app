import { Order } from 'appjusto-types';
import React from 'react';
import { t } from '../../../../strings';
import RoundedText from '../../../components/texts/RoundedText';
import * as helpers from '../../../store/api/order/helpers';
import { formatDistance, formatDuration, separateWithDot } from '../../../utils/formatters';

interface Props {
  order: Order;
}

export const CourierDistanceBadge = ({ order }: Props) => {
  const { route, courier, dispatchingState } = order;
  if (!route || !courier) return null;
  const distance = helpers.courierDistanceFromNextPlace(order);
  let text = '';
  if (dispatchingState === 'going-pickup' || dispatchingState === 'going-destination') {
    text = separateWithDot(formatDistance(distance), formatDuration(route.duration));
    // text = formatDistance(distance);
  } else if (dispatchingState === 'arrived-pickup' || dispatchingState === 'arrived-destination') {
    text = t('Entregador no local');
  }
  return <RoundedText>{text}</RoundedText>;
};
