import { Card, Order, WithId, Fare, Fleet, Place } from 'appjusto-types';
import { isEmpty } from 'lodash';
import React, { useState, useMemo, useCallback, useContext, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import * as icons from '../../../../assets/icons';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import RoundedText from '../../../../common/components/texts/RoundedText';
import HR from '../../../../common/components/views/HR';
import ShowIf from '../../../../common/components/views/ShowIf';
import { getOrderQuotes } from '../../../../common/store/order/actions';
import { getUIBusy } from '../../../../common/store/ui/selectors';
import { texts, colors, screens, padding, borders } from '../../../../common/styles';
import {
  formatDistance,
  formatDuration,
  formatCurrency,
  separateWithDot,
} from '../../../../common/utils/formatters';
import { t } from '../../../../strings';
import OrderMap from './OrderMap';
import PlaceSummary from './PlaceSummary';

type Props = {
  origin: Partial<Place>;
  destination: Partial<Place>;
  order: WithId<Order>;
  card?: Card;
  waiting: boolean;
  editStepHandler: (index: number) => void;
  confirmOrder: (fleetId: string, platformFee: number) => void;
  navigateToFillPaymentInfo: () => void;
  navigateFleetDetail: (fleet: Fleet) => void;
};

export default function ({
  origin,
  destination,
  order,
  card,
  waiting,
  editStepHandler,
  confirmOrder,
  navigateToFillPaymentInfo,
  navigateFleetDetail,
}: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const { height } = Dimensions.get('window');
  const { distance, duration } = order;

  // app state
  const busy = useSelector(getUIBusy);

  // state
  const [quotes, setQuotes] = useState<Fare[]>();
  const [selectedFare, setSelectedFare] = useState<Fare>();
  const canSubmit = useMemo(() => {
    return card !== undefined && selectedFare !== undefined && !waiting;
  }, [card, selectedFare, waiting]);

  // side effects
  useEffect(() => {
    getOrderQuotesHandler();
  }, [order]);

  useEffect(() => {
    if (!isEmpty(quotes)) setSelectedFare(quotes![0]);
  }, [quotes]);

  // handlers
  const getOrderQuotesHandler = useCallback(async () => {
    (async () => {
      setQuotes((await dispatch(getOrderQuotes(api)(order.id))) ?? undefined);
    })();
  }, [order]);

  // UI
  return (
    <ScrollView style={{ flex: 1, marginBottom: 24 }}>
      {/* show map if it was hidden on previous pages */}
      <ShowIf test={height < 700}>
        {() => (
          <View style={{ height: 160 }}>
            <OrderMap order={order} />
          </View>
        )}
      </ShowIf>
      <View style={{ flex: 1 }}>
        {/* origin, destination, distance, duration */}
        <PaddedView>
          <PlaceSummary
            title={t('Retirada')}
            place={origin}
            editStepHandler={() => editStepHandler(0)}
          />
          <PlaceSummary
            title={t('Entrega')}
            place={destination}
            editStepHandler={() => editStepHandler(1)}
          />

          <RoundedText>
            {separateWithDot(formatDistance(distance), formatDuration(duration))}
          </RoundedText>
        </PaddedView>

        <HR height={padding} />

        {/* choose fare */}
        <PaddedView>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <Image source={icons.greenRectangle} style={{ marginRight: 12 }} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                flex: 1,
              }}
            >
              <Text style={{ ...texts.medium, ...texts.bold }}>{t('Escolha a frota')}</Text>
              <Text style={{ ...texts.small, color: colors.darkGrey }}>
                {quotes?.length ?? 0} {t('frotas ativas agora')}
              </Text>
            </View>
          </View>
          <Text style={{ ...texts.small, color: colors.darkGrey, marginBottom: 12 }}>
            {t(
              'Você pode escolher a frota que quiser para sua entrega. Frotas podem ter preços e características diferentes.'
            )}
          </Text>
          <ShowIf test={isEmpty(quotes)}>
            {() => (
              <DefaultButton
                title={t('Click para tentar novamente')}
                onPress={getOrderQuotesHandler}
                activityIndicator={busy}
                disabled={busy}
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
                    <PaddedView
                      style={{
                        width: 156,
                        backgroundColor: colors.lightGreen,
                        ...borders.default,
                        borderWidth: 2,
                        borderColor: colors.black,
                      }}
                    >
                      <Text numberOfLines={2} style={[texts.default, texts.bold]}>
                        {item.fleet.name}
                      </Text>
                      <Text style={[texts.small, { marginTop: padding }]}>{t('Entregadores')}</Text>
                      <Text style={[texts.small, texts.bold]}>
                        {item.fleet.participantsOnline} {t('ativos agora')}
                      </Text>
                      <Text style={[texts.mediumToBig, texts.bold, { marginTop: padding }]}>
                        {formatCurrency(item.total)}
                      </Text>
                      <TouchableOpacity onPress={() => navigateFleetDetail(item.fleet)}>
                        <View style={{ marginTop: padding }}>
                          <RoundedText>{t('Ver detalhes')}</RoundedText>
                        </View>
                      </TouchableOpacity>
                    </PaddedView>
                  );
                }}
                horizontal
              />
            )}
          </ShowIf>
        </PaddedView>

        <HR height={padding} />

        {/* details */}
        <PaddedView style={{ ...screens.default }}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <Image source={icons.greenRectangle} style={{ marginRight: 12 }} />
              <Text style={{ ...texts.medium, ...texts.bold }}>{t('Entenda os valores')}</Text>
            </View>
            <Text style={{ ...texts.small, color: colors.darkGrey }}>
              {t('Somos transparentes do início ao fim da entrega')}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 16,
            }}
          >
            <Text style={{ ...texts.default, lineHeight: 21 }}>{t('Entregador')}</Text>
            <Text style={{ ...texts.default, lineHeight: 21 }}>
              {formatCurrency(selectedFare?.courierFee ?? 0)}
            </Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ ...texts.default, lineHeight: 21 }}>{t('Frota escolhida')}</Text>
            {/* find out how to display the fleet name below */}
            <Text style={{ ...texts.default, lineHeight: 21 }}>App Justo</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ ...texts.default, lineHeight: 21, color: colors.darkGrey }}>
              {t('Impostos')}
            </Text>
            <Text style={{ ...texts.default, lineHeight: 21, color: colors.darkGrey }}>
              {formatCurrency(selectedFare?.taxes ?? 0)}
            </Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ ...texts.default, lineHeight: 21, color: colors.darkGrey }}>
              {t('Tarifa financeira')}
            </Text>
            <Text style={{ ...texts.default, lineHeight: 21, color: colors.darkGrey }}>
              {formatCurrency(selectedFare?.financialFee ?? 0)}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 12,
            }}
          >
            <Text style={{ ...texts.default, lineHeight: 21 }}>{t('AppJusto')}</Text>
            <Text style={{ ...texts.default, lineHeight: 21 }}>
              {formatCurrency(selectedFare?.platformFee ?? 0)}
            </Text>
          </View>
          <Text style={{ ...texts.small, lineHeight: 19, color: colors.darkGrey }}>
            O AppJusto cobra menos para ser mais justo com todos. Você pode aumentar a sua
            contribuição se desejar.
          </Text>
        </PaddedView>
        <HR height={padding} />
        <PaddedView>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Image source={icons.greenRectangle} style={{ marginRight: 12 }} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                flex: 1,
              }}
            >
              <Text style={{ ...texts.medium, ...texts.bold }}>{t('Valor total a pagar')}</Text>
              <Text style={{ ...texts.mediumToBig }}>
                {formatCurrency(selectedFare?.total ?? 0)}
              </Text>
            </View>
          </View>
        </PaddedView>
      </View>
      <HR height={padding} />
      <ShowIf test={!!card}>
        {() => (
          <TouchableOpacity onPress={() => navigateToFillPaymentInfo()}>
            <PaddedView>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <Text style={{ ...texts.medium }}>{t('Forma de pagamento')}</Text>
                <Image style={{ width: 32, height: 32 }} source={icons.edit} />
              </View>
              <Text style={{ ...texts.default, color: colors.darkGrey }}>
                {t(`Cartão de crédito: **** ${card!.lastFourDigits}`)}
              </Text>
            </PaddedView>
          </TouchableOpacity>
        )}
      </ShowIf>

      <ShowIf test={!card}>
        {() => (
          <DefaultButton
            style={{ width: '100%' }}
            title={t('Incluir forma de pagamento')}
            onPress={navigateToFillPaymentInfo}
          />
        )}
      </ShowIf>

      <DefaultButton
        style={{ marginHorizontal: padding, marginVertical: padding }}
        title={t('Fazer pedido')}
        onPress={() => confirmOrder(selectedFare?.fleet?.id!, 100)}
        disabled={!canSubmit}
        activityIndicator={waiting}
      />
    </ScrollView>
  );
}
