import { IuguMarketplaceAccountReceivables } from '@appjusto/types/payment/iugu';
import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../../app/context';
import { getCourier } from '../../../courier/selectors';

export const useReceivables = () => {
  // context
  const api = React.useContext(ApiContext);
  // redux store
  const courier = useSelector(getCourier);
  const courierId = courier?.id;
  // state
  const [receivables, setReceivables] = React.useState<IuguMarketplaceAccountReceivables>();
  // side-effects
  React.useEffect(() => {
    if (!courierId) return;
    (async () => {
      setReceivables(await api.courier().fetchReceivables(courierId));
    })();
  }, [courierId, api]);
  return receivables;
};
