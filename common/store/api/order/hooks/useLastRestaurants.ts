import { Business, WithId } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../../../app/context';

export const useLastRestaurants = (consumerId?: string) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [lastRests, setLastRests] = React.useState<WithId<Business>[]>([]);
  // side-effects
  // fetching the last orders
  React.useEffect(() => {
    if (!consumerId) return;
    (async () => {
      setLastRests(await api.order().getMostRecentRestaurants(consumerId));
    })();
  }, [api, consumerId]);
  return lastRests;
};
