import { Card, WithId } from '@appjusto/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../../app/context';
import { getConsumer } from '../../../consumer/selectors';

export const useCards = () => {
  // context
  const api = React.useContext(ApiContext);
  // redux store
  const consumerId = useSelector(getConsumer)!.id;
  // state
  const [cards, setCards] = React.useState<WithId<Card>[]>();
  // side-effects
  React.useEffect(() => {
    (async () => {
      setCards(await api.consumer().fetchCards(consumerId));
    })();
  }, [api, consumerId]);

  return cards;
};
