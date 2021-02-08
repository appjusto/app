import { Order, WithId } from 'appjusto-types';
import { difference } from 'lodash';
import React from 'react';
import { useDispatch } from 'react-redux';
import { OngoingOrdersStatuses } from '..';
import { ApiContext, AppDispatch } from '../../../../app/context';
import { ORDERS_UPDATED } from '../../../order/actions';
import { ObserveOrdersOptions } from '../types';

export default function (options: ObserveOrdersOptions) {
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  // app state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  const [ids, setIds] = React.useState<string[]>([]);

  // side effects
  // once
  // observe orders
  React.useEffect(() => {
    return api.order().observeOrders({ ...options, statuses: OngoingOrdersStatuses }, setOrders);
  }, []);
  // whenever orders change
  // update ids
  React.useEffect(() => {
    dispatch({ type: ORDERS_UPDATED, payload: orders });
    const ordersIds = orders.map((order) => order.id);
    // updating ids only when necessary
    if (difference(ids, ordersIds).length !== 0 || difference(ordersIds, ids).length !== 0) {
      setIds(ordersIds);
    }
  }, [orders]);
}
