import { Fleet, WithId } from 'appjusto-types';
import { useContext, useMemo } from 'react';
import { InfiniteQueryResult, useInfiniteQuery } from 'react-query';
import { ApiContext } from '../../app/context';
import { documentsAs, FirebaseDocument } from '../../store/api/types';

export default function (
  search: string = ''
): [WithId<Fleet>[], InfiniteQueryResult<FirebaseDocument[]>] {
  const api = useContext(ApiContext);
  const fetchFleets = (key: string, search?: string, startAfter?: FirebaseDocument) => {
    return api.fleet().fetchFleets({ search, startAfter });
  };
  const query = useInfiniteQuery(['fleets', search], fetchFleets, {
    getFetchMore: (lastGroup) => lastGroup[lastGroup.length - 1],
  });
  const fleets = useMemo(() => {
    if (!query.data) return [];
    return query.data.reduce<WithId<Fleet>[]>((fleets, group) => {
      return [...fleets, ...documentsAs<Fleet>(group)];
    }, []);
  }, [query.data]);

  return [fleets, query];
}
