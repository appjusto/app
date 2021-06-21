import { OrderConfirmation } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../../../app/context';

export const useObserveOrderConfirmation = (orderId: string | undefined) => {
  // context
  const api = React.useContext(ApiContext);
  // app state
  const [confirmation, setConfirmation] = React.useState<OrderConfirmation>();
  // side effects
  // observe order confirmation
  React.useEffect(() => {
    if (!orderId) return;
    return api.order().observeOrderConfirmation(orderId, setConfirmation);
  }, [api, orderId]);
  // result
  return confirmation;
};
