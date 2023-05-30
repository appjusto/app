import { Payment, WithId } from '@appjusto/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../../app/context';
import { getConsumer } from '../../../consumer/selectors';

export const useObservePendingOrderPayment = (orderId: string) => {
  // context
  const api = React.useContext(ApiContext);
  const consumer = useSelector(getConsumer)!;
  // state
  const [payment, setPayment] = React.useState<WithId<Payment> | null>();
  // side effects
  React.useEffect(() => {
    (async () => {
      await api
        .order()
        .payments()
        .observePayments(
          {
            orderId,
            consumerId: consumer.id,
            status: 'pending',
            limit: 1,
          },
          (payments) => setPayment(payments.length ? payments[0] : null)
        );
    })();
  }, [orderId, api, consumer.id]);
  // result
  return payment;
};
