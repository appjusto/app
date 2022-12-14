import { LedgerEntry } from '@appjusto/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../../app/context';
import { getCourier } from '../../../courier/selectors';

export const useDeliveryLedgerEntry = (orderId: string) => {
  // context
  const api = React.useContext(ApiContext);
  // redux store
  const courierId = useSelector(getCourier)!.id;
  // state
  const [ledgerEntry, setLedgerEntry] = React.useState<LedgerEntry | null>();
  // side-effects
  React.useEffect(() => {
    (async () => {
      setLedgerEntry(await api.courier().fetchOtherLedgerEntries(courierId, orderId));
    })();
  }, [api, courierId, orderId]);

  return ledgerEntry;
};
