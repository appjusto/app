import firebase from 'firebase';
import { useEffect, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, ApiContext } from '../screens/app/context';
import { ObserveOrdersOptions } from '../store/api/order';
import { observeOrders, observeOrderChat } from '../store/order/actions';
import { getOngoingOrders } from '../store/order/selectors';

export default function (options: ObserveOrdersOptions) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  // app state
  const ongoingOrders = useSelector(getOngoingOrders);

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
    const newUnsubscribers = ongoingOrders.map((order) =>
      dispatch(observeOrderChat(api)(order.id))
    );
    setUnsubscribers(newUnsubscribers);
    console.groupEnd();
  }, [ongoingOrders]);

  // unsubscribe
  useEffect(() => {
    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [unsubscribers]);
}
