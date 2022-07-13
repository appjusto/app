import { WithId } from '@appjusto/types';
import React from 'react';
import { Invoice } from '../../../../../../types';
import { ApiContext } from '../../../../app/context';

export const useObservePendingOrderInvoice = (orderId: string) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [invoice, setInvoice] = React.useState<WithId<Invoice> | null>();
  // side effects
  React.useEffect(() => {
    (async () => {
      await api
        .order()
        .invoice()
        .observeInvoices(
          { orderId, invoiceType: 'order', status: 'pending', limit: 1 },
          (invoices) => setInvoice(invoices.length ? invoices[0] : null)
        );
    })();
  }, [orderId]);
  // result
  return invoice;
};
