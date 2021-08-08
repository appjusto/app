import { FetchAccountInformationResponse } from '@appjusto/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../../app/context';
import { getCourier } from '../../../courier/selectors';

export const useMarketplaceAccountInfo = () => {
  // context
  const api = React.useContext(ApiContext);
  // redux store
  const courier = useSelector(getCourier);
  const courierId = courier?.id;
  // state
  const [info, setInfo] = React.useState<FetchAccountInformationResponse>();
  // side-effects
  React.useEffect(() => {
    if (!courierId) return;
    (async () => {
      setInfo(await api.courier().fetchAccountInformation(courierId));
    })();
  }, [courierId, api]);
  return info;
};
