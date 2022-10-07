import { IuguMarketplaceAccountAdvanceByAmountSimulation } from '@appjusto/types/payment/iugu';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../../app/context';
import { getCourier } from '../../../courier/selectors';
import { useMarketplaceAccountInfo } from './useMarketplaceAccountInfo';

export const useAdvanceByAmountSimulation = () => {
  // context
  const api = React.useContext(ApiContext);
  const navigation = useNavigation();
  const info = useMarketplaceAccountInfo();
  // redux store
  const courier = useSelector(getCourier);
  const courierId = courier?.id;
  // state
  const [simulationByAmount, setSimulationByAmount] =
    React.useState<IuguMarketplaceAccountAdvanceByAmountSimulation>();
  const fetchSimulationByAmount = async () => {
    if (!info) return;
    setSimulationByAmount(undefined);
    setSimulationByAmount(
      await api.courier().fetchAdvanceByAmountSimulation(courierId!, info.advanceable_value)
    );
  };
  // side-effects
  React.useEffect(() => {
    if (!courierId) return;
    fetchSimulationByAmount();
  }, [courierId, api, info]);
  React.useEffect(() => {
    navigation.addListener('focus', fetchSimulationByAmount);
    return () => navigation.removeListener('focus', fetchSimulationByAmount);
  });
  return simulationByAmount;
};
