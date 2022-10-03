import { WithId } from '@appjusto/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { Invoice, InvoiceType } from '../../../../../../types';
import { ApiContext } from '../../../../app/context';
import { getConsumer } from '../../../consumer/selectors';

export const useObservePendingOrderInvoice = (orderId: string, invoiceType?: InvoiceType) => {
  // context
  const api = React.useContext(ApiContext);
  const consumer = useSelector(getConsumer)!;
  // state
  const [invoice, setInvoice] = React.useState<WithId<Invoice> | null>();
  // side effects
  React.useEffect(() => {
    (async () => {
      await api
        .order()
        .invoice()
        .observeInvoices(
          {
            orderId,
            consumerId: consumer.id,
            invoiceType: invoiceType ?? 'order',
            status: 'pending',
            limit: 1,
          },
          (invoices) => setInvoice(invoices.length ? invoices[0] : null)
        );
    })();
  }, [orderId]);
  // result
  return invoice;
};
