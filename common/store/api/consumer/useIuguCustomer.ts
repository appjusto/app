import { IuguCustomer } from '@appjusto/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../app/context';
import { getConsumer } from '../../consumer/selectors';

export const useIuguCustomer = () => {
  // context
  const api = React.useContext(ApiContext);
  // redux store
  const consumerId = useSelector(getConsumer)!.id;
  // state
  const [customer, setIuguCustomer] = React.useState<IuguCustomer | null>();
  // side-effects
  React.useEffect(() => {
    (async () => {
      setIuguCustomer(await api.consumer().fetchIuguCustomer(consumerId));
    })();
  }, [api, consumerId]);

  return customer;
};
