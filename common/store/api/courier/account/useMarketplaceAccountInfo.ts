import { FetchAccountInformationResponse } from '@appjusto/types';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../../app/context';
import { getCourier } from '../../../courier/selectors';

export const useMarketplaceAccountInfo = () => {
  // context
  const api = React.useContext(ApiContext);
  const navigation = useNavigation();
  // redux store
  const courier = useSelector(getCourier);
  const courierId = courier?.id;
  // state
  const [info, setInfo] = React.useState<FetchAccountInformationResponse>();
  const fetchAccountInformation = async () => {
    setInfo(undefined);
    setInfo(await api.courier().fetchAccountInformation(courierId!));
  };
  // side-effects
  React.useEffect(() => {
    if (!courierId) return;
    fetchAccountInformation();
  }, [courierId, api]);
  React.useEffect(() => {
    navigation.addListener('focus', fetchAccountInformation);
    return () => navigation.removeListener('focus', fetchAccountInformation);
  });
  return info;
};
