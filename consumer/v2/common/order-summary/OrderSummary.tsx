import { Fare, Order, WithId } from '@appjusto/types';
import { Feather } from '@expo/vector-icons';
import { isEmpty } from 'lodash';
import React from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import HR from '../../../../common/components/views/HR';
import OrderMap from '../../../../common/screens/orders/OrderMap';
import { OrderAdditionalInfo } from '../../../../common/screens/orders/summary/OrderAdditionaInfo';
import { showToast } from '../../../../common/store/ui/actions';
import { getUIBusy } from '../../../../common/store/ui/selectors';
import { borders, colors, halfPadding, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { Step } from '../../p2p/types';
import { OrderCostBreakdown } from '../breakdown/OrderCostBreakdown';
import { OrderAvailableFleets } from './OrderAvailableFleets';
import { OrderItems } from './OrderItems';
import { OrderPayment } from './OrderPayment';
import { OrderPlacesSummary } from './OrderPlacesSummary';
import { OrderTotal } from './OrderTotal';

type Props = {
  order: WithId<Order>;
  selectedPaymentMethodId?: string;
  waiting: boolean;
  showMap: boolean;
  onEditStep: (step: Step) => void;
  onEditItemPress?: (productId: string, itemId: string) => void;
  onAddItemsPress?: () => void;
  placeOrder: (fleetId: string) => void;
  navigateToFillPaymentInfo: () => void;
  navigateFleetDetail: (fleetId: string) => void;
  modalVisible: boolean;
  navigateToPixPayment: (total: number, fleetId: string) => void;
  onModalClose?: () => void;
  navigateToAboutCharges: () => void;
  additionalInfo?: string;
  onAddInfo?: (text: string) => void;
  cpf: string;
  setCpf: (value: string) => void;
  wantsCpf: boolean;
  onSwitchValueChange: (value: boolean) => void;
  shareDataWithBusiness?: boolean;
  onShareData?: (value: boolean) => void;
};

export const OrderSummary = ({
  order,
  selectedPaymentMethodId,
  waiting,
  showMap,
  onEditStep,
  onEditItemPress,
  onAddItemsPress,
  placeOrder,
  navigateToFillPaymentInfo,
  navigateFleetDetail,
  modalVisible,
  onModalClose,
  navigateToPixPayment,
  navigateToAboutCharges,
  additionalInfo,
  onAddInfo,
  cpf,
  setCpf,
  wantsCpf,
  onSwitchValueChange,

  shareDataWithBusiness,
  onShareData,
}: Props) => {
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // state
  const busy = useSelector(getUIBusy);
  const [quotes, setQuotes] = React.useState<Fare[]>();
  const [selectedFare, setSelectedFare] = React.useState<Fare>();
  // const [additionalInfo, setAdditionalInfo] = React.useState('');
  const canSubmit = React.useMemo(() => {
    return selectedPaymentMethodId !== undefined && selectedFare !== undefined && !waiting;
  }, [selectedPaymentMethodId, selectedFare, waiting]);
  // side effects
  // whenever order changes
  // update quotes
  React.useEffect(() => {
    getOrderQuotesHandler();
  }, [order]);
  // whenever quotes are updated
  // select first fare and subscribe to involved fleets updates
  React.useEffect(() => {
    if (!quotes || isEmpty(quotes)) return;
    setSelectedFare(quotes[0]);
  }, [quotes]);

  // handlers
  const getOrderQuotesHandler = React.useCallback(async () => {
    if (!order.origin?.location || !order.route?.distance) {
      if (order.route?.issue) dispatch(showToast(order.route.issue, 'error'));
      return;
    }
    (async () => {
      setQuotes(undefined);
      try {
        setQuotes(await api.order().getOrderQuotes(order.id));
      } catch (error) {
        dispatch(showToast(error.toString(), 'error'));
      }
    })();
  }, [order, dispatch, api]);

  // UI
  return (
    <ScrollView style={{ flex: 1, marginBottom: 24 }}>
      {showMap && (
        <View style={{ height: 160 }}>
          <OrderMap order={order} ratio={360 / 160} />
        </View>
      )}
      <View>
        <OrderPlacesSummary order={order} onEditStep={onEditStep} />
      </View>

      {!isEmpty(order.items) && (
        <View>
          <HR height={padding} />
          <OrderItems
            order={order}
            onEditItemPress={onEditItemPress!}
            onAddItemsPress={onAddItemsPress!}
            onModalClose={onModalClose!}
            modalVisible={modalVisible}
          />
          <OrderAdditionalInfo value={additionalInfo} onAddInfo={onAddInfo} />
        </View>
      )}
      {order.type === 'food' && (
        <View style={{ flex: 1, marginHorizontal: padding, marginBottom: padding }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: halfPadding }}>
            <Feather name="share-2" size={14} style={{ marginRight: 4 }} />
            <Text style={{ ...texts.sm, color: colors.black }}>
              {t('Compartilhar dados com o restaurante')}
            </Text>
          </View>
          <Text style={{ ...texts.xs, color: colors.grey700 }}>
            {t(
              'Aceito compartilhar meu nome, e-mail e telefone para eventuais promoções desse restaurante'
            )}
          </Text>
          <View style={{ marginTop: halfPadding, flexDirection: 'row', alignItems: 'center' }}>
            <Switch
              trackColor={{ false: colors.white, true: colors.white }}
              thumbColor={shareDataWithBusiness ? colors.green500 : colors.yellow}
              ios_backgroundColor={colors.white}
              onValueChange={onShareData}
              value={shareDataWithBusiness}
              style={{ ...borders.default }}
            />
            <Text style={{ ...texts.sm, marginLeft: padding }}>{t('Compartilhar dados')}</Text>
          </View>
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

      <OrderCostBreakdown order={order} selectedFare={selectedFare!} />

      <HR height={padding} />

      <OrderTotal
        total={selectedFare?.total ?? 0}
        switchValue={wantsCpf}
        onSwitchValueChange={onSwitchValueChange}
        cpf={cpf}
        setCpf={setCpf}
      />

      <HR height={padding} />

      <OrderPayment
        selectedPaymentMethodId={selectedPaymentMethodId}
        onEditPaymentMethod={navigateToFillPaymentInfo}
        isSubmitEnabled={canSubmit}
        onSubmit={() => placeOrder(selectedFare?.fleet?.id!)}
        activityIndicator={busy}
        navigateToPixPayment={() => null}
        navigateToAboutCharges={navigateToAboutCharges}
      />
    </ScrollView>
  );
};
