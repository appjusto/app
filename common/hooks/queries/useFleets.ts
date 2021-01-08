import { Fleet, WithId } from 'appjusto-types';
import firebase from 'firebase';
import { useContext } from 'react';
import { useInfiniteQuery } from 'react-query';
import { ApiContext } from '../../app/context';
import { documentsAs, FirebaseDocument } from '../../store/api/types';

export default function (search: string = '') {
  const api = useContext(ApiContext);
  const query = useInfiniteQuery<
    firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>[],
    Error
  >(
    ['fleets', search],
    ({ pageParam }) =>
      api.fleet().fetchFleets({ search, startAfter: pageParam as FirebaseDocument }),
    {
      getNextPageParam: (lastGroup) => lastGroup[lastGroup.length - 1],
    }
  );
  const fleets = (query.data?.pages ?? []).reduce<WithId<Fleet>[]>(
    (fleets, docs) => [...fleets, ...documentsAs<Fleet>(docs)],
    []
  );
  return { fleets, query };
}
