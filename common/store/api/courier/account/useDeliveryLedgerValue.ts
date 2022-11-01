import { LedgerEntry } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../../../app/context';

export const useDeliveryLedgerEntry = (courierId?: string, orderId?: string) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [ledgerEntry, setLedgerEntry] = React.useState<LedgerEntry | null>();
  // side-effects
  React.useEffect(() => {
    if (!courierId) return;
    if (!orderId) return;
    (async () => {
      setLedgerEntry(await api.courier().fetchDeliveryLedgerEntry(courierId, orderId));
    })();
  }, [api, courierId, orderId]);

  return ledgerEntry;
};
