import { LedgerEntry, WithId } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../../../app/context';

export const useLedgerPendingValues = (courierId?: string) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [invoices, setInvoices] = React.useState<WithId<LedgerEntry>[]>();
  const [value, setValue] = React.useState<number>(0);

  // side-effects
  // fecthing invoices
  React.useEffect(() => {
    if (!courierId) return;
    (async () => {
      setInvoices(await api.courier().fetchCourierLedgerPendingInvoices(courierId));
    })();
  }, [api, courierId]);
  // calculating total value
  React.useEffect(() => {
    if (!invoices) return;
    if (invoices.length > 0) {
      setValue(invoices.reduce((total, invoice) => total + invoice.value, 0));
    }
  }, [invoices]);

  return value;
};
