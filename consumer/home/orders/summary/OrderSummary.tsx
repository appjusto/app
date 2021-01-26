import { Fare, Fleet, Order, WithId } from 'appjusto-types';
import { IuguCustomerPaymentMethod } from 'appjusto-types/payment/iugu';
import { isEmpty } from 'lodash';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import * as icons from '../../../../assets/icons';
import { ApiContext } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import HR from '../../../../common/components/views/HR';
import Pill from '../../../../common/components/views/Pill';
import ShowIf from '../../../../common/components/views/ShowIf';
import { colors, padding, texts } from '../../../../common/styles';
import { formatCurrency } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';
import AddInfo from '../../restaurants/components/AddInfo';
import OrderMap from '../p2p-order/OrderMap';
import { Step } from '../p2p-order/types';
import { OrderAvailableFleets } from './OrderAvailableFleets';
import { OrderCostBreakdown } from './OrderCostBreakdown';
import { OrderItems } from './OrderItems';
import { OrderPlacesSummary } from './OrderPlacesSummary';

type Props = {
  order: WithId<Order>;
  paymentMethod?: IuguCustomerPaymentMethod;
  waiting: boolean;
  showMap: boolean;
  onEditStep: (step: Step) => void;
  placeOrder: (fleetId: string, platformFee: number) => void;
  navigateToFillPaymentInfo: () => void;
  navigateFleetDetail: (fleet: WithId<Fleet>) => void;
};

export default function ({
  order,
  paymentMethod,
  waiting,
  showMap,
  onEditStep,
  placeOrder,
  navigateToFillPaymentInfo,
  navigateFleetDetail,
}: Props) {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [quotes, setQuotes] = React.useState<Fare[]>();
  const [selectedFare, setSelectedFare] = React.useState<Fare>();
  const [platformFee, setPlatformFee] = React.useState(100);
  const [notes, setNotes] = React.useState('');
  const canSubmit = React.useMemo(() => {
    return paymentMethod !== undefined && selectedFare !== undefined && !waiting;
  }, [paymentMethod, selectedFare, waiting]);

  console.log(quotes);

  // side effects
  // whenever route changes
  // update quotes
  React.useEffect(() => {
    getOrderQuotesHandler();
  }, [order.route?.distance]);
  // whenever quotes are updated
  // select first fare and subscribe to involved fleets updates
  React.useEffect(() => {
    if (!quotes || isEmpty(quotes)) return;
    setSelectedFare(quotes[0]);
  }, [quotes]);

  // handlers
  const getOrderQuotesHandler = React.useCallback(async () => {
    if (!order.origin?.location || !order.route) return;
    (async () => {
      setQuotes(undefined);
      // try {
      setQuotes(await api.order().getOrderQuotes(order.id));
      // } catch (error) {}
    })();
  }, [order]);

  // UI
  return (
    <ScrollView style={{ flex: 1, marginBottom: 24 }}>
      {/* show map if it was hidden on previous pages */}
      <ShowIf test={showMap}>
        {() => (
          <View style={{ height: 160 }}>
            <OrderMap order={order} />
          </View>
        )}
      </ShowIf>
      <View style={{ flex: 1 }}>
        <OrderPlacesSummary order={order} onEditStep={onEditStep} />

        {order.type === 'food' && (
          <View>
            <OrderItems order={order} />
            <HR height={padding} />
            <AddInfo value={notes} onAddInfo={setNotes} />
          </View>
        )}

        <HR height={padding} />

        <OrderAvailableFleets
          quotes={quotes}
          selectedFare={selectedFare}
          onFareSelect={(fare) => setSelectedFare(fare)}
          onFleetSelect={navigateFleetDetail}
          onRetry={getOrderQuotesHandler}
        />

        <HR height={padding} />
        {/* details */}
        <OrderCostBreakdown
          selectedFare={selectedFare!}
          selectedPlatformFee={platformFee}
          platformFeeOptions={[100, 300, 500, 800, 1000]}
          onChangeFee={setPlatformFee}
        />
        <HR height={padding} />
        {/* total */}
        <View style={{ paddingVertical: padding }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Pill />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: 12,
                flex: 1,
              }}
            >
              <Text style={{ ...texts.medium, ...texts.bold }}>{t('Valor total a pagar')}</Text>
              <Text style={{ ...texts.mediumToBig }}>
                {formatCurrency((selectedFare?.total ?? 0) + platformFee)}
              </Text>
            </View>
          </View>
          <Text
            style={{
              marginTop: padding,
              ...texts.small,
              color: colors.darkGrey,
              paddingHorizontal: padding,
            }}
          >
            {t(
              'Você poderá deixar uma Caixinha de gorjeta para o entregador quando o seu pedido for entregue.'
            )}
          </Text>
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
                  {`${t('Cartão de crédito')}: **** ${paymentMethod!.data.last_digits}`}
                </Text>
              </PaddedView>
            </TouchableOpacity>
          )}
        </ShowIf>

        <ShowIf test={!paymentMethod}>
          {() => (
            <DefaultButton
              title={t('Finalizar cadastro e adicionar pagamento')}
              onPress={navigateToFillPaymentInfo}
              secondary
            />
          )}
        </ShowIf>

        <DefaultButton
          style={{ marginTop: padding }}
          title={t('Confirmar pedido')}
          onPress={() => placeOrder(selectedFare?.fleet?.id!, platformFee)}
          disabled={!canSubmit}
          activityIndicator={waiting}
        />
      </PaddedView>
    </ScrollView>
  );
}
