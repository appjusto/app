import { Order } from 'appjusto-types';
import React from 'react';
import { t } from '../../../../strings';
import RoundedText from '../../../components/texts/RoundedText';
import * as helpers from '../../../store/api/order/helpers';
import { colors } from '../../../styles';
import { formatDistance } from '../../../utils/formatters';

interface Props {
  order: Order;
}

export const CourierDistanceBadge = ({ order }: Props) => {
  const { dispatchingState, route } = order;
  if (!route) return null;
  const distance = helpers.courierDistanceFromNextPlace(order);
  let text = '';
  if (dispatchingState === 'going-pickup' || dispatchingState === 'going-destination') {
    // text = separateWithDot(formatDistance(distance), formatDuration(route.duration));
    text = formatDistance(distance);
  } else if (dispatchingState === 'arrived-pickup' || dispatchingState === 'arrived-destination') {
    text = t('Entregador no local');
  }
  return (
    <RoundedText backgroundColor={colors.lightGrey} color={colors.darkGrey} noBorder>
      {text}
    </RoundedText>
  );
};
