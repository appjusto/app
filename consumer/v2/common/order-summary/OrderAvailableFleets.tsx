import { Fare, Fleet, WithId } from '@appjusto/types';
import { isEmpty } from 'lodash';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { ApiContext } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import RoundedText from '../../../../common/components/texts/RoundedText';
import Pill from '../../../../common/components/views/Pill';
import ShowIf from '../../../../common/components/views/ShowIf';
import { borders, colors, halfPadding, padding, texts } from '../../../../common/styles';
import { formatCurrency } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';

interface Props {
  quotes: Fare[] | undefined;
  selectedFare: Fare | undefined;
  onFareSelect: (fare: Fare) => void;
  onFleetSelect: (fleet: WithId<Fleet>) => void;
  onRetry: () => void;
}

export const OrderAvailableFleets = ({
  quotes,
  selectedFare,
  onFareSelect,
  onFleetSelect,
  onRetry,
}: Props) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [fleets, setFleets] = React.useState<WithId<Fleet>[]>([]);
  // side effects
  React.useEffect(() => {
    if (!quotes || isEmpty(quotes)) return;
    const fleetsIds = quotes.map((quote) => quote.fleet.id);
    return api.fleet().observeFleets(setFleets, { fleetsIds });
  }, [quotes]);
  // UI
  const isLoading = quotes === undefined;
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Pill />
        <PaddedView
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ ...texts.md, ...texts.bold }}>{t('Escolha a frota')}</Text>
          <Text style={{ ...texts.xs, color: colors.grey700 }}>
            {quotes?.length ?? 0} {t('frota(s) ativas agora')}
          </Text>
        </PaddedView>
      </View>
      <PaddedView>
        <Text style={{ ...texts.xs, color: colors.grey700, marginBottom: 12 }}>
          {t(
            'Você pode escolher a frota que quiser para sua entrega. Frotas podem ter preços e características diferentes.'
          )}
        </Text>
        <ShowIf test={isEmpty(quotes)}>
          {() => (
            <DefaultButton
              title={t('Click para tentar novamente')}
              onPress={onRetry}
              activityIndicator={isLoading}
              disabled={isLoading}
            />
          )}
        </ShowIf>
        <ShowIf test={!isEmpty(quotes)}>
          {() => (
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={quotes}
              keyExtractor={(item) => item.fleet.id!}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity onPress={() => onFareSelect(item)}>
                    <PaddedView
                      style={{
                        width: 156,
                        backgroundColor:
                          selectedFare?.fleet.id === item.fleet.id ? colors.green100 : colors.white,
                        ...borders.default,
                        borderWidth: 2,
                        borderColor: colors.black,
                        marginRight: halfPadding,
                      }}
                    >
                      <Text numberOfLines={2} style={[texts.sm, texts.bold]}>
                        {item.fleet.name}
                      </Text>
                      <Text style={[texts.xs, { marginTop: padding }]}>{t('Entregadores')}</Text>
                      <Text style={[texts.xs, texts.bold]}>
                        {`${
                          fleets.find((fleet) => fleet.id === item.fleet.id)?.participantsOnline ??
                          0
                        } ${t('ativos agora')}`}
                      </Text>
                      <Text style={[texts.xl, texts.bold, { marginTop: padding }]}>
                        {formatCurrency(item.consumer.courierFee)}
                      </Text>
                      <TouchableOpacity onPress={() => onFleetSelect(item.fleet)}>
                        <View style={{ marginTop: padding }}>
                          <RoundedText>{t('Ver detalhes')}</RoundedText>
                        </View>
                      </TouchableOpacity>
                    </PaddedView>
                  </TouchableOpacity>
                );
              }}
              horizontal
            />
          )}
        </ShowIf>
      </PaddedView>
    </View>
  );
};
