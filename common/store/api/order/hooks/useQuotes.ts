import { Fare } from '@appjusto/types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { PayableWith } from '../../../../../../types';
import { ApiContext, AppDispatch } from '../../../../app/context';
import { showToast } from '../../../ui/actions';
import { getOrderTotal } from '../helpers';
import { useObserveOrder } from './useObserveOrder';

export const useQuotes = (orderId?: string, paymentMethod?: PayableWith) => {
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // state
  const order = useObserveOrder(orderId);
  const [quotes, setQuotes] = React.useState<Fare[]>();
  // helper callback
  const getOrderQuotes = async () => {
    if (!order) return;
    if (!order.origin?.location || !order.route?.distance || !order.destination?.location) {
      if (order.route?.issue) dispatch(showToast(order.route.issue, 'error'));
      return;
    }
    setQuotes(undefined);
    try {
      setQuotes(await api.order().getOrderQuotes({ orderId: order.id, paymentMethod }));
    } catch (error: any) {
      dispatch(showToast(error.toString(), 'error'));
    }
  };
  const scheduledTo = order?.scheduledTo?.toString();
  const itemsValue = getOrderTotal(order ?? undefined);
  // side-effects
  // update quotes
  React.useEffect(() => {
    console.log('getOrderQuotes', [
      order?.id,
      order?.route?.distance,
      order?.route?.issue,
      itemsValue,
      order?.fulfillment,
      order?.destination?.location?.latitude,
      paymentMethod,
    ]);
    getOrderQuotes();
  }, [
    order?.id,
    order?.route?.distance,
    order?.route?.issue,
    itemsValue,
    order?.fulfillment,
    order?.destination?.location?.latitude,
    paymentMethod,
    scheduledTo,
  ]);
  return quotes;
};
