import firebase from 'firebase';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../app/context';
import { observeOrderChat, observeOrders } from '../../../order/actions';
import { getOngoingOrders, getOrders } from '../../../order/selectors';
import { ObserveOrdersOptions } from '../types';

export default function (options: ObserveOrdersOptions) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  // app state
  const orders = useSelector(getOrders);

  // hook state
  const [unsubscribers, setUnsubscribers] = useState<firebase.Unsubscribe[]>([]);

  // side effects
  // observe all orders
  useEffect(() => {
    return dispatch(observeOrders(api)(options));
  }, []);

  // observe chat of all ongoing orders
  useEffect(() => {
    unsubscribers.forEach((unsub) => unsub());
    const ongoingOrders = getOngoingOrders(orders);
    const newUnsubscribers = ongoingOrders.map((order) =>
      dispatch(observeOrderChat(api)(order.id))
    );
    setUnsubscribers(newUnsubscribers);
  }, [orders]);

  // unsubscribe
  useEffect(() => {
    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [unsubscribers]);

  return orders;
}
