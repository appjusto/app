import { SearchResponse } from '@algolia/client-search';
import { Fleet, WithId } from 'appjusto-types';
import { debounce } from 'lodash';
import React from 'react';
import { ApiContext } from '../../../app/context';

export const useSearchFleets = (search?: string) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [response, setResponse] = React.useState<SearchResponse<Fleet>>();
  const [fleets, setFleets] = React.useState<WithId<Fleet>[]>();
  const [isLoading, setLoading] = React.useState(false);
  // side effects
  const debouncedSearch = React.useCallback(
    debounce<(input: string, page?: number) => void>(async (input, page) => {
      setLoading(true);
      setResponse(await api.search().searchFleets(input, page));
      setLoading(false);
    }, 500),
    []
  );
  // debounce search when search input changes
  React.useEffect(() => {
    if (search === undefined) return;
    debouncedSearch(search);
  }, [search]);
  // update results when response changes
  React.useEffect(() => {
    if (!response) return;
    const newFleets = response.hits.map((r) => ({ ...r, id: r.objectID } as WithId<Fleet>));
    if (response.page === 0) setFleets(newFleets);
    else setFleets([...(fleets ?? []), ...newFleets]);
  }, [response]);
  // result
  const fetchNextPage = React.useCallback(() => {
    if (search === undefined) return;
    if (!response) return;
    const hasNextPage = response.page + 1 < response.nbPages;
    if (hasNextPage) debouncedSearch(search, response.page + 1);
  }, [search, response]);
  const refetch = React.useCallback(() => {
    if (isLoading) return;
    setFleets([]);
    debouncedSearch(search!);
  }, [search, isLoading]);
  return { fleets, isLoading, refetch, fetchNextPage };
};
