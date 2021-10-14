import { Fare, Order, WithId } from '@appjusto/types';
import { isEmpty } from 'lodash';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import Pill from '../../../../common/components/views/Pill';
import ShowIf from '../../../../common/components/views/ShowIf';
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
  const fleets = (quotes ?? []).map((quote) => quote.fleet);
  const orderedFares = (quotes ?? [])
    .sort((a, b) => b.fleet.participantsOnline - a.fleet.participantsOnline)
    .slice(0, 2);
  // UI
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Pill />
        <PaddedView
          style={{
            flex: 1,
            // flexDirection: 'row',
            // justifyContent: 'space-between',
            // alignItems: 'center',
          }}
        >
          <Text style={{ ...texts.md, ...texts.bold }}>
            {t('Escolha a frota para a sua entrega')}
          </Text>
          {/* {isLoading ? null : quotes?.length ? (
            <Text style={{ ...texts.xs, color: colors.grey700 }}>
              {t('Exibindo ')}
              {quotes?.length ?? 0}
            </Text>
          ) : (
            <Text style={{ ...texts.xs, color: colors.grey700 }}>
              {t('Sem frotas disponíveis')}
            </Text>
          )} */}
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
                {quotes?.length ? (
                  <Text style={{ ...texts.xs, color: colors.grey700, marginBottom: 12 }}>
                    {t(
                      'Frotas podem ter preços e características diferentes. \nParticipantes recebem o valor total definido pela frota.'
                    )}
                  </Text>
                ) : (
                  <Text style={{ ...texts.xs, color: colors.grey700, marginBottom: 12 }}>
                    {t(
                      'Infelizmente estamos sem entregadores disponíveis...\n Tente novamente em alguns minutos.'
                    )}
                  </Text>
                )}
                <ShowIf test={isEmpty(quotes)}>
                  {() => (
                    <DefaultButton
                      title={t('Procurar frotas disponíveis')}
                      onPress={onRetry}
                      activityIndicator={isLoading}
                      disabled={isLoading}
                    />
                  )}
                </ShowIf>
                <ShowIf test={!isEmpty(quotes)}>
                  {() => (
                    <View style={{ marginBottom: padding }}>
                      {orderedFares.map((item) => {
                        return (
                          <View key={item.fleet.id} style={{ marginBottom: padding }}>
                            <FleetListItem
                              item={item}
                              selectedFare={selectedFare?.fleet.id === item.fleet.id}
                              onFareSelect={() => onFareSelect(item)}
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
                      {/*TODO: remove this after tests */}
                      <DefaultButton
                        secondary
                        title={`${t('Ver todas as frotas')} ${quotes.length} ${t('disponíveis')}`}
                        onPress={navigateToAvailableFleets}
                      />
                    </View>
                    // <FlatList
                    //   showsHorizontalScrollIndicator={false}
                    //   data={quotes}
                    //   keyExtractor={(item) => item.fleet.id!}
                    //   renderItem={({ item }) => {
                    //     return (
                    //       <View>
                    //         <TouchableOpacity onPress={() => onFareSelect(item)}>
                    //           <PaddedView
                    //             style={{
                    //               width: 156,
                    //               backgroundColor:
                    //                 selectedFare?.fleet.id === item.fleet.id
                    //                   ? colors.green100
                    //                   : colors.white,
                    //               ...borders.default,
                    //               borderWidth: 2,
                    //               borderColor: colors.black,
                    //               marginRight: halfPadding,
                    //             }}
                    //           >
                    //             <Text numberOfLines={2} style={[texts.sm, texts.bold]}>
                    //               {item.fleet.name}
                    //             </Text>
                    //             <Text style={[texts.xs, { marginTop: padding }]}>
                    //               {t('Entregadores')}
                    //             </Text>
                    //             <Text style={[texts.xs, texts.bold]}>
                    //               {`${
                    //                 fleets.find((fleet) => fleet.id === item.fleet.id)
                    //                   ?.participantsOnline ?? 0
                    //               } ${t('ativos agora')}`}
                    //             </Text>
                    //             <Text style={[texts.xl, texts.bold, { marginTop: padding }]}>
                    //               {formatCurrency(item.courier.value)}
                    //             </Text>
                    //             <TouchableOpacity onPress={() => onFleetSelect(item.fleet.id)}>
                    //               <View style={{ marginTop: padding }}>
                    //                 <RoundedText>{t('Ver detalhes')}</RoundedText>
                    //               </View>
                    //             </TouchableOpacity>
                    //           </PaddedView>
                    //         </TouchableOpacity>
                    //       </View>
                    //     );
                    //   }}
                    //   horizontal
                    // />
                  )}
                </ShowIf>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};
