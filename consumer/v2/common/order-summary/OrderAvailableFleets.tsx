import { Fare, Order, WithId } from '@appjusto/types';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import SingleHeader from '../../../../common/components/texts/SingleHeader';
import { colors, padding, screens, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { FleetListItem } from '../FleetListItem';
import { RouteIssueCard } from './RouteIssueCard';

interface Props {
  quotes: Fare[] | undefined;
  selectedFare: Fare | undefined;
  onFareSelect: (fare: Fare) => void;
  onFleetSelect: (fleetId: string) => void;
  order: WithId<Order>;
  navigateToAvailableFleets: () => void;
}

export const OrderAvailableFleets = ({
  quotes,
  selectedFare,
  onFareSelect,
  onFleetSelect,
  order,
  navigateToAvailableFleets,
}: Props) => {
  const { fulfillment, scheduledTo } = order;
  if (fulfillment !== 'delivery') return null;
  if (scheduledTo) return null;
  const isLoading = quotes === undefined;
  const orderedFares = (quotes ?? []).slice(0, 3);
  const getContent = () => {
    if (isLoading) {
      return (
        <View style={screens.centered}>
          <ActivityIndicator size="large" color={colors.green500} />
        </View>
      );
    }
    if (order.route?.issue) {
      return <RouteIssueCard issue={order.route.issue} />;
    }
    const privateFleet = selectedFare?.fleet?.createdBy?.flavor === 'business';
    const aboutFleetsText = privateFleet
      ? 'A entrega do seu pedido será feita pelo próprio restaurante. Qualquer dúvida, entre em contato com o estabelecimento.'
      : 'Frotas definem as condições de participação, como o preço ganho por km. O AppJusto não fica com nada do valor pago pela entrega.';
    return (
      <View>
        <Text style={{ ...texts.xs, color: colors.grey700, marginBottom: 12 }}>
          {aboutFleetsText}
        </Text>

        <View style={{ marginBottom: padding }}>
          {orderedFares.map((item) =>
            item.fleet ? (
              <View key={item.fleet?.id} style={{ marginBottom: padding }}>
                <FleetListItem
                  item={item}
                  selectedFare={selectedFare?.fleet?.id === item.fleet?.id}
                  onFareSelect={(item) => onFareSelect(item)}
                  onFleetDetail={() => onFleetSelect(item.fleet!.id)}
                />
              </View>
            ) : null
          )}
          {quotes.length >= 3 ? (
            <DefaultButton
              variant="secondary"
              title={`${t('Ver todas as')} ${quotes.length} ${t('frotas disponíveis')}`}
              onPress={navigateToAvailableFleets}
            />
          ) : null}
        </View>
      </View>
    );
  };
  // UI
  return (
    <View>
      <SingleHeader title={t('Entrega')} />
      <View style={{ paddingHorizontal: padding }}>{getContent()}</View>
    </View>
  );
};
