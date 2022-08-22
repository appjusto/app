import { Fare } from '@appjusto/types';
import React from 'react';
import { Keyboard } from 'react-native';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../app/context';
import { showToast } from '../../../ui/actions';
import { useObserveOrder } from './useObserveOrder';

export const useQuotes = (orderId?: string) => {
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // state
  const order = useObserveOrder(orderId);
  const [quotes, setQuotes] = React.useState<Fare[]>();
  // helper callback
  const getOrderQuotes = async () => {
    if (!order) return;
    Keyboard.dismiss(); // why?
    if (!order.origin?.location || !order.route?.distance) {
      if (order.route?.issue) dispatch(showToast(order.route.issue, 'error'));
      return;
    }
    setQuotes(undefined);
    try {
      setQuotes(
        await api.order().getOrderQuotes(order.id, order.scheduledTo ? ['appjusto'] : undefined)
      );
    } catch (error: any) {
      dispatch(showToast(error.toString(), 'error'));
    }
  };
  // side-effects
  // update quotes
  React.useEffect(() => {
    getOrderQuotes();
  }, [order?.id, order?.route?.distance, order?.route?.issue, order?.items, order?.fulfillment]);
  return quotes;
};
