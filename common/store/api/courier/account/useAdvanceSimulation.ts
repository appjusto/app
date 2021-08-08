import { IuguMarketplaceAccountAdvanceSimulation } from '@appjusto/types/payment/iugu';
import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../../app/context';
import { getCourier } from '../../../courier/selectors';

export const useAdvanceSimulation = (ids: number[]) => {
  // context
  const api = React.useContext(ApiContext);
  // redux store
  const courier = useSelector(getCourier);
  const courierId = courier?.id;
  // state
  const [simulation, setSimulation] = React.useState<IuguMarketplaceAccountAdvanceSimulation>();
  // side-effects
  React.useEffect(() => {
    if (!courierId) return;
    (async () => {
      setSimulation(await api.courier().fetchAdvanceSimulation(courierId, ids));
    })();
  }, [courierId, api]);
  return simulation;
};
