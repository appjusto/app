import { Order, WithId } from '@appjusto/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../../app/context';
import { getConsumer } from '../../../consumer/selectors';

export const observeUnexpiredConsumerOrders = () => {
  // context
  const api = React.useContext(ApiContext);
  // redux
  const consumer = useSelector(getConsumer)!;
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>();
  // side effects
  // observe orders
  React.useEffect(() => {
    if (!consumer) return;
    return api.order().observeUnexpiredConsumerOrders(consumer.id, setOrders);
  }, [api, consumer]);
  // result
  return orders;
};
