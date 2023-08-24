import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../../app/context';
import { getConsumer } from '../../../consumer/selectors';

export const useCredits = () => {
  // context
  const api = React.useContext(ApiContext);
  // redux store
  const consumerId = useSelector(getConsumer)!.id;
  // state
  const [credits, setCredits] = React.useState<number>();
  // side-effects
  React.useEffect(() => {
    api.consumer().fetchCredits(consumerId).then(setCredits).catch(console.error);
  }, [api, consumerId]);

  return credits;
};
