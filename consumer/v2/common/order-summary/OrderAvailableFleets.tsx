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
  const isLoading = quotes === undefined;
  const orderedFares = (quotes ?? []).slice(0, 3);
  if (scheduledTo) return null;
  // UI
  return (
    <View>
      <SingleHeader title={t('Escolha a frota para a sua entrega')} />
      <View style={{ paddingHorizontal: padding }}>
        {isLoading ? (
          <View style={screens.centered}>
            <ActivityIndicator size="large" color={colors.green500} />
          </View>
        ) : (
          <View>
            {order.route?.issue ? (
              <RouteIssueCard issue={order.route.issue} />
            ) : (
              <View>
                {quotes.length === 1 &&
                quotes[0].fleet?.participantsOnline === 0 &&
                fulfillment === 'delivery' ? (
                  <Text style={{ ...texts.xs, color: colors.grey700, marginBottom: 12 }}>
                    {t(
                      'Sua entrega poderá ser feita por uma empresa parceira caso não haja entregadores online no momento'
                    )}
                  </Text>
                ) : (
                  <Text style={{ ...texts.xs, color: colors.grey700, marginBottom: 12 }}>
                    {t(
                      'Frotas podem ter preços e características diferentes. \nParticipantes recebem o valor total definido pela frota.'
                    )}
                  </Text>
                )}
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
            )}
          </View>
        )}
      </View>
    </View>
  );
};
