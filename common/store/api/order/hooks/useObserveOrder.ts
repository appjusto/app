import { Order, WithId } from '@appjusto/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../../app/context';
import { getUser } from '../../../user/selectors';

export const useObserveOrder = (orderId: string | undefined) => {
  // context
  const api = React.useContext(ApiContext);
  // redux
  const user = useSelector(getUser);
  // state
  const [order, setOrder] = React.useState<WithId<Order> | null>();
  // side effects
  // observe order
  React.useEffect(() => {
    if (!user) return;
    if (!orderId) return;
    try {
      return api.order().observeOrder(orderId, setOrder);
    } catch (error) {
      setOrder(null);
    }
  }, [user, orderId, api]);
  // result
  return order;
};
