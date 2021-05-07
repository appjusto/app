import { Fleet, WithId } from '@appjusto/types';
import firebase from 'firebase';
import React from 'react';
import { ApiContext } from '../../../../app/context';
export const useObserveFleets = () => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [fleets, setFleets] = React.useState<WithId<Fleet>[]>();
  const [startAfter, setStartAfter] = React.useState<
    firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  >();
  const [lastFleet, setLastFleet] = React.useState<
    firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  >();
  // side effects
  // observe order
  React.useEffect(() => {
    return api.fleet().observeFleets((results, last) => {
      if (!startAfter) setFleets(results);
      else setFleets([...(fleets ?? []), ...results]);
      setLastFleet(last);
    }, startAfter);
  }, [startAfter]);
  // result
  const fetchNextPage = React.useCallback(() => {
    setStartAfter(lastFleet);
  }, [lastFleet]);
  return { fleets, fetchNextPage };
};
