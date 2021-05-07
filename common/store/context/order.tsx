import { Order, WithId } from '@appjusto/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { useObserveOrders } from '../api/order/hooks/useObserveOrders';
import { getUser } from '../user/selectors';

interface Props {
  businessId: string;
  children: React.ReactNode | React.ReactNode[];
}

interface Value {
  order?: WithId<Order>;
}

const ActiveOrderContext = React.createContext<Value>({});
ActiveOrderContext.displayName = 'ActiveOrderContext';

export const ActiveOrderProvider = ({ businessId, children }: Props) => {
  // redux
  const user = useSelector(getUser);
  // state
  const [order] = useObserveOrders(
    React.useMemo(() => ({ businessId, consumerId: user?.uid, statuses: ['quote'], limit: 1 }), [
      businessId,
      user?.uid,
    ])
  );
  const value: Value = { order };
  return <ActiveOrderContext.Provider value={value}>{children}</ActiveOrderContext.Provider>;
};

export const useContextActiveOrder = () => {
  const value = React.useContext(ActiveOrderContext);
  return value.order;
};
