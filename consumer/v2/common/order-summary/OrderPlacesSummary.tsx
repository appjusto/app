import { Order } from '@appjusto/types';
import React from 'react';
import { View } from 'react-native';
import RoundedText from '../../../../common/components/texts/RoundedText';
import PlaceSummary from '../../../../common/screens/orders/summary/PlaceSummary';
import { padding } from '../../../../common/styles';
import { formatDistance, separateWithDot } from '../../../../common/utils/formatters';
import { getETAWithMargin } from '../../../../common/utils/formatters/datetime';
import { t } from '../../../../strings';
import { Step } from '../../p2p/types';

interface Props {
  order: Order;
  onEditStep: (step: Step) => void;
}

export const OrderPlacesSummary = ({ order, onEditStep }: Props) => {
  const { origin, destination, route, arrivals } = order;
  return (
    <View
      style={{
        paddingHorizontal: padding,
        paddingTop: padding,
        paddingBottom: order.type === 'p2p' ? padding : undefined,
      }}
    >
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
      {route?.distance && arrivals?.destination?.estimate && order.type === 'p2p' ? (
        <RoundedText>
          {separateWithDot(
            formatDistance(route.distance),
            `${t('Previsão:')} ${getETAWithMargin(arrivals.destination.estimate)}`
          )}
        </RoundedText>
      ) : null}
    </View>
  );
};
