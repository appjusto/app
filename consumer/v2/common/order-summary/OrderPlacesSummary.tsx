import { Order } from '@appjusto/types';
import React from 'react';
import PaddedView from '../../../../common/components/containers/PaddedView';
import RoundedText from '../../../../common/components/texts/RoundedText';
import PlaceSummary from '../../../../common/screens/orders/summary/PlaceSummary';
import {
  formatDistance,
  formatDuration,
  separateWithDot,
} from '../../../../common/utils/formatters';
import { t } from '../../../../strings';
import { Step } from '../../p2p/types';

interface Props {
  order: Order;
  onEditStep: (step: Step) => void;
}

export const OrderPlacesSummary = ({ order, onEditStep }: Props) => {
  const { origin, destination, route } = order;
  return (
    <PaddedView>
      {origin && (
        <PlaceSummary
          title={order.type === 'p2p' ? t('Retirada') : t('Restaurante')}
          place={origin!}
          onEdit={order.type === 'p2p' ? () => onEditStep(Step.Origin) : undefined}
        />
      )}
      {destination && (
        <PlaceSummary
          title={t('Entrega')}
          place={destination}
          onEdit={() => onEditStep(Step.Destination)}
        />
      )}
      {route && (
        <RoundedText>
          {separateWithDot(
            formatDistance(route.distance),
            `${t('Estimativa: ')}${formatDuration(route.duration)}`
          )}
        </RoundedText>
      )}
    </PaddedView>
  );
};
