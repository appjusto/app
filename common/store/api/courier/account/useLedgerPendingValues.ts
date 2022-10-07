import { LedgerEntry, WithId } from '@appjusto/types';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ApiContext } from '../../../../app/context';

export const useLedgerPendingValues = (courierId?: string) => {
  // context
  const api = React.useContext(ApiContext);
  const navigation = useNavigation();
  // state
  const [invoices, setInvoices] = React.useState<WithId<LedgerEntry>[]>();
  const [value, setValue] = React.useState<number>();
  // helper
  const fetchInvoices = async () => {
    setInvoices(undefined);
    setInvoices(await api.courier().fetchCourierLedgerPendingInvoices(courierId!));
  };

  // side-effects
  // fecthing invoices
  React.useEffect(() => {
    if (!courierId) return;
    fetchInvoices();
  }, [courierId, api]);
  // calculating total value
  React.useEffect(() => {
    if (!invoices) return;
    if (invoices.length > 0) {
      setValue(invoices.reduce((total, invoice) => total + invoice.value, 0));
    } else setValue(0);
  }, [invoices]);
  React.useEffect(() => {
    navigation.addListener('focus', fetchInvoices);
    return () => navigation.removeListener('focus', fetchInvoices);
  });

  return value;
};
