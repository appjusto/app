import { SearchResponse } from '@algolia/client-search';
import { LatLng } from '@appjusto/types';
import { debounce } from 'lodash';
import React from 'react';
import { ApiContext } from '../../../app/context';
import { SearchFilter, SearchKind, SearchOrder } from '../../consumer/types';

export const useSearch = <T extends object>(
  enabled: boolean,
  kind: SearchKind,
  order: SearchOrder,
  filters: SearchFilter[],
  coords: LatLng | undefined | null,
  name?: string
) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [lastResponse, setLastResponse] = React.useState<SearchResponse<T>>();
  const [responseByPage, setResponseByPage] =
    React.useState<Map<number | undefined, SearchResponse<T>>>();
  const [results, setResults] = React.useState<T[]>();
  const [isLoading, setLoading] = React.useState(true);
  // helpers
  const search = React.useCallback(
    async (location: LatLng, input: string, filters: SearchFilter[], page?: number) => {
      setLoading(true);
      setLastResponse(await api.search().search<T>(kind, order, filters, location, input, page));
      setLoading(false);
    },
    [api, kind, order]
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = React.useCallback(
    debounce<(location: LatLng, input: string, filters: SearchFilter[], page?: number) => void>(
      search,
      500
    ),
    [search]
  );
  // side effects
  // clearing cache
  React.useEffect(() => {
    api.search().clearCache();
  }, [api]);
  React.useEffect(() => {
    if (!lastResponse) return;
    setResponseByPage((current) => {
      const value = current ? new Map(current.entries()) : new Map();
      value.set(lastResponse.page, lastResponse);
      return value;
    });
  }, [lastResponse]);
  // debounce search when search input changes
  React.useEffect(() => {
    if (!enabled) return;
    if (name === undefined) return;
    if (!coords) return;
    debouncedSearch(coords, name, filters);
  }, [enabled, name, coords, debouncedSearch, filters]);
  // update results when response changes
  React.useEffect(() => {
    if (!responseByPage) {
      setResults(undefined);
      return;
    }
    setResults(
      Array.from(responseByPage.values()).reduce(
        (result, response) => [...result, ...response.hits],
        [] as T[]
      )
    );
  }, [responseByPage]);
  // result
  const fetchNextPage = React.useCallback(() => {
    // console.log('fetchNextPage', name, coords, !responseByPage, !lastResponse);
    if (name === undefined) return;
    if (!coords) return;
    if (!responseByPage) return;
    if (!lastResponse) return;
    const hasNextPage = lastResponse.page + 1 < lastResponse.nbPages;
    // console.log('hasNextPage', hasNextPage);
    if (hasNextPage) search(coords, name, filters, lastResponse.page + 1);
  }, [name, coords, responseByPage, search, filters]);
  // }, [name, coords, filters, lastResponse, responseByPage, search]);

  const refetch = () => {
    if (name === undefined) return;
    if (!coords) return;
    setResponseByPage(undefined);
    return search(coords, name, filters);
  };

  return { results, isLoading, refetch, fetchNextPage };
};
