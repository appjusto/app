import { Fare, Order, WithId } from '@appjusto/types';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import Pill from '../../../../common/components/views/Pill';
import { colors, padding, screens, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { FleetListItem } from '../FleetListItem';
import { RouteIssueCard } from './RouteIssueCard';

interface Props {
  quotes: Fare[] | undefined;
  selectedFare: Fare | undefined;
  onFareSelect: (fare: Fare) => void;
  onFleetSelect: (fleetId: string) => void;
  onRetry: () => void;
  order: WithId<Order>;
  navigateToAvailableFleets: () => void;
}

export const OrderAvailableFleets = ({
  quotes,
  selectedFare,
  onFareSelect,
  onFleetSelect,
  onRetry,
  order,
  navigateToAvailableFleets,
}: Props) => {
  // helpers
  const isLoading = quotes === undefined;
  const orderedFares = (quotes ?? [])
    .sort((a, b) => b.fleet.participantsOnline - a.fleet.participantsOnline)
    .slice(0, 3);
  // UI
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Pill />
        <PaddedView
          style={{
            flex: 1,
          }}
        >
          <Text style={{ ...texts.md, ...texts.bold }}>
            {t('Escolha a frota para a sua entrega')}
          </Text>
        </PaddedView>
      </View>
      <View style={{ paddingHorizontal: padding }}>
        {isLoading ? (
          <View style={screens.centered}>
            <ActivityIndicator size="large" color={colors.green500} />
          </View>
        ) : (
          <View>
            {order.route?.issue ? (
              <RouteIssueCard />
            ) : (
              <View>
                {quotes.length === 1 && quotes[0].fleet.participantsOnline === 0 ? (
                  <Text style={{ ...texts.xs, color: colors.grey700, marginBottom: 12 }}>
                    {t(
                      'Estamos com poucos entregadores no momento. Sua entrega poderá ser feita por uma empresa parceira'
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
                  {orderedFares.map((item) => {
                    return (
                      <View key={item.fleet.id} style={{ marginBottom: padding }}>
                        <FleetListItem
                          item={item}
                          selectedFare={selectedFare?.fleet.id === item.fleet.id}
                          onFareSelect={(item) => onFareSelect(item)}
                          onFleetDetail={() => onFleetSelect(item.fleet.id)}
                        />
                      </View>
                    );
                  })}
                  {quotes.length >= 3 ? (
                    <DefaultButton
                      secondary
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
