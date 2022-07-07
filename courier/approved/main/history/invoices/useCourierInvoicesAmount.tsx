import { Invoice, WithId } from '@appjusto/types';
import dayjs from 'dayjs';
import React from 'react';
import { ApiContext } from '../../../../../common/app/context';

export const useCourierInvoicesAmount = (
  kind: 'month' | 'week',
  courierId?: string,
  period?: Date | null
) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [invoices, setInvoices] = React.useState<WithId<Invoice>[]>();
  const [amount, setAmount] = React.useState(0);
  // side effects
  React.useEffect(() => {
    if (!courierId) return;
    if (!period) return;
    const start =
      kind === 'month'
        ? dayjs(period).startOf('month').toDate()
        : dayjs(period).startOf('week').toDate();
    const end =
      kind === 'month'
        ? dayjs(period).endOf('month').toDate()
        : dayjs(period).endOf('week').toDate();
    const unsubscribe = api
      .courier()
      .observeCourierInvoices({ courierId, status: 'paid', start, end }, setInvoices);
    return () => unsubscribe();
  }, [api, courierId, period, kind]);
  React.useEffect(() => {
    if (!invoices) return;
    const amount = invoices.reduce((total, invoice) => {
      return (total += invoice.value ?? 0);
    }, 0);
    setAmount(amount);
  }, [invoices]);
  // return
  return amount;
};
