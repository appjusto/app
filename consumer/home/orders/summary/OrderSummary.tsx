import { Fare, Fleet, Order, WithId } from 'appjusto-types';
import { isEmpty } from 'lodash';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import HR from '../../../../common/components/views/HR';
import { showToast } from '../../../../common/store/ui/actions';
import { getUIBusy } from '../../../../common/store/ui/selectors';
import { padding } from '../../../../common/styles';
import AddInfo from '../../restaurants/components/AddInfo';
import OrderMap from '../p2p-order/OrderMap';
import { Step } from '../p2p-order/types';
import { OrderCostBreakdown } from './breakdown/OrderCostBreakdown';
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
  placeOrder: (fleetId: string, platformFee: number) => void;
  navigateToFillPaymentInfo: () => void;
  navigateFleetDetail: (fleet: WithId<Fleet>) => void;
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
}: Props) => {
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // state
  const busy = useSelector(getUIBusy);
  const [quotes, setQuotes] = React.useState<Fare[]>();
  const [selectedFare, setSelectedFare] = React.useState<Fare>();
  const [notes, setNotes] = React.useState('');
  const canSubmit = React.useMemo(() => {
    return selectedPaymentMethodId !== undefined && selectedFare !== undefined && !waiting;
  }, [selectedPaymentMethodId, selectedFare, waiting]);
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
      try {
        setQuotes(await api.order().getOrderQuotes(order.id));
      } catch (error) {
        dispatch(showToast(error));
      }
    })();
  }, [order]);

  // UI
  return (
    <ScrollView style={{ flex: 1, marginBottom: 24 }}>
      {showMap && (
        <View style={{ height: 160 }}>
          <OrderMap order={order} />
        </View>
      )}

      <OrderPlacesSummary order={order} onEditStep={onEditStep} />

      {!isEmpty(order.items) && (
        <View>
          <HR height={padding} />
          <OrderItems
            order={order}
            onEditItemPress={onEditItemPress!}
            onAddItemsPress={onAddItemsPress!}
          />
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

      <OrderCostBreakdown order={order} selectedFare={selectedFare!} />

      <HR height={padding} />

      <OrderTotal total={selectedFare?.consumer.total ?? 0} />

      <HR height={padding} />

      <OrderPayment
        selectedPaymentMethodId={selectedPaymentMethodId}
        onEditPaymentMethod={navigateToFillPaymentInfo}
        isSubmitEnabled={canSubmit}
        onSubmit={() => placeOrder(selectedFare?.fleet?.id!, 100)}
        activityIndicator={busy}
      />
    </ScrollView>
  );
};
