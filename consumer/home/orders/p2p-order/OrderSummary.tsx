import { Fare, Fleet, Order, Place, WithId } from 'appjusto-types';
import { IuguCustomerPaymentMethod } from 'appjusto-types/payment/iugu';
import { isEmpty } from 'lodash';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as icons from '../../../../assets/icons';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import HorizontalSelect, {
  HorizontalSelectItem,
} from '../../../../common/components/buttons/HorizontalSelect';
import PaddedView from '../../../../common/components/containers/PaddedView';
import RoundedText from '../../../../common/components/texts/RoundedText';
import HR from '../../../../common/components/views/HR';
import Pill from '../../../../common/components/views/Pill';
import ShowIf from '../../../../common/components/views/ShowIf';
import useTallerDevice from '../../../../common/hooks/useTallerDevice';
import { observeFleets } from '../../../../common/store/fleet/actions';
import { getAvailableFleets } from '../../../../common/store/fleet/selectors';
import { getOrderQuotes } from '../../../../common/store/order/actions';
import { getUIBusy } from '../../../../common/store/ui/selectors';
import { borders, colors, halfPadding, padding, texts } from '../../../../common/styles';
import {
  formatCurrency,
  formatDistance,
  formatDuration,
  separateWithDot,
} from '../../../../common/utils/formatters';
import { t } from '../../../../strings';
import OrderMap from './OrderMap';
import PlaceSummary from './PlaceSummary';

type Props = {
  origin: Partial<Place>;
  destination: Partial<Place>;
  order: WithId<Order>;
  paymentMethod?: IuguCustomerPaymentMethod;
  waiting: boolean;
  editStepHandler: (index: number) => void;
  placeOrder: (fleetId: string, platformFee: number) => void;
  navigateToFillPaymentInfo: () => void;
  navigateFleetDetail: (fleet: WithId<Fleet>) => void;
};

const platformFeeOptions: HorizontalSelectItem[] = [
  { id: '1', title: formatCurrency(100), data: 100 },
  { id: '3', title: formatCurrency(300), data: 300 },
  { id: '5', title: formatCurrency(500), data: 500 },
  { id: '8', title: formatCurrency(800), data: 800 },
  { id: '10', title: formatCurrency(1000), data: 1000 },
];

export default function ({
  origin,
  destination,
  order,
  paymentMethod,
  waiting,
  editStepHandler,
  placeOrder,
  navigateToFillPaymentInfo,
  navigateFleetDetail,
}: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const { distance, duration } = order;
  const tallDevice = useTallerDevice();

  // app state
  const busy = useSelector(getUIBusy);
  const availableFleets = useSelector(getAvailableFleets) ?? [];

  // state
  const [quotes, setQuotes] = useState<Fare[]>([]);
  const [selectedFare, setSelectedFare] = useState<Fare>();
  const [platformFee, setPlatformFee] = useState(platformFeeOptions[0]);
  const canSubmit = useMemo(() => {
    return paymentMethod !== undefined && selectedFare !== undefined && !waiting;
  }, [paymentMethod, selectedFare, waiting]);

  // side effects
  // once
  // observe fleets
  useEffect(() => {
    return dispatch(observeFleets(api));
  }, []);
  // whenever order changes
  // update quotes
  useEffect(() => {
    getOrderQuotesHandler();
  }, [order]);
  // whenever quotes are updated
  // select first fare
  useEffect(() => {
    if (!isEmpty(quotes)) {
      setSelectedFare(quotes[0]);
    }
  }, [quotes]);
  const participantsOnlineByFleet: {
    [key: string]: number;
  } = useMemo(() => {
    return availableFleets.reduce((acc, fleet) => {
      return { ...acc, [fleet.id]: fleet.participantsOnline ?? 0 };
    }, {});
  }, [availableFleets]);

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
      <ShowIf test={!tallDevice}>
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

        {/* choose fleet */}
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
              <Text style={{ ...texts.medium, ...texts.bold }}>{t('Escolha a frota')}</Text>
              <Text style={{ ...texts.small, color: colors.darkGrey }}>
                {quotes.length} {t('frotas ativas agora')}
              </Text>
            </PaddedView>
          </View>
          <PaddedView>
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
                      <TouchableHighlight onPress={() => setSelectedFare(item)}>
                        <PaddedView
                          style={{
                            width: 156,
                            backgroundColor:
                              selectedFare?.fleet.id === item.fleet.id
                                ? colors.lightGreen
                                : colors.white,
                            ...borders.default,
                            borderWidth: 2,
                            borderColor: colors.black,
                            marginRight: halfPadding,
                          }}
                        >
                          <Text numberOfLines={2} style={[texts.default, texts.bold]}>
                            {item.fleet.name}
                          </Text>
                          <Text style={[texts.small, { marginTop: padding }]}>
                            {t('Entregadores')}
                          </Text>
                          <Text style={[texts.small, texts.bold]}>
                            {`${participantsOnlineByFleet[item.fleet.id] ?? 0} ${t(
                              'ativos agora'
                            )}`}
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
                      </TouchableHighlight>
                    );
                  }}
                  horizontal
                />
              )}
            </ShowIf>
          </PaddedView>
        </View>
        <HR height={padding} />
        {/* details */}
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
              <Text style={{ ...texts.medium, ...texts.bold }}>{t('Entenda os valores')}</Text>
            </PaddedView>
          </View>
          <PaddedView>
            <Text style={{ ...texts.small, color: colors.darkGrey }}>
              {t('Somos transparentes do início ao fim da entrega')}
            </Text>
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
                {formatCurrency(platformFee.data)}
              </Text>
            </View>
            <Text style={{ marginTop: padding, ...texts.small, color: colors.darkGrey }}>
              O AppJusto cobra menos para ser mais justo com todos. Você pode aumentar a sua
              contribuição se desejar.
            </Text>
            <View style={{ marginTop: padding }}>
              <HorizontalSelect
                data={platformFeeOptions}
                selected={platformFee}
                onSelect={setPlatformFee}
              />
            </View>
          </PaddedView>
        </View>
        <HR height={padding} />
        {/* total */}
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
            <Text style={{ ...texts.medium, ...texts.bold }}>{t('Valor total a pagar')}</Text>
            <Text style={{ ...texts.mediumToBig }}>
              {formatCurrency((selectedFare?.total ?? 0) + platformFee.data)}
            </Text>
          </PaddedView>
        </View>
      </View>
      <HR height={padding} />
      <PaddedView>
        <ShowIf test={!!paymentMethod}>
          {() => (
            <TouchableOpacity onPress={() => navigateToFillPaymentInfo()}>
              <PaddedView>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ ...texts.medium }}>{t('Forma de pagamento')}</Text>
                  <Image style={{ width: 32, height: 32 }} source={icons.edit} />
                </View>
                <Text style={{ ...texts.default, color: colors.darkGrey }}>
                  {t(`Cartão de crédito: **** ${paymentMethod!.data.last_digits}`)}
                </Text>
              </PaddedView>
            </TouchableOpacity>
          )}
        </ShowIf>

        <ShowIf test={!paymentMethod}>
          {() => (
            <DefaultButton
              title={t('Incluir forma de pagamento')}
              onPress={navigateToFillPaymentInfo}
            />
          )}
        </ShowIf>

        <DefaultButton
          style={{ marginTop: padding }}
          title={t('Fazer pedido')}
          onPress={() => placeOrder(selectedFare?.fleet?.id!, platformFee.data)}
          disabled={!canSubmit}
          activityIndicator={waiting}
        />
      </PaddedView>
    </ScrollView>
  );
}
