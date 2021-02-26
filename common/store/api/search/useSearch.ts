import { SearchResponse } from '@algolia/client-search';
import { LatLng } from 'appjusto-types';
import { debounce } from 'lodash';
import React from 'react';
import { ApiContext } from '../../../app/context';
import { SearchFilter, SearchKind, SearchOrder } from '../../consumer/types';

export const useSearch = <T extends object>(
  enabled: boolean,
  kind: SearchKind,
  order: SearchOrder,
  filters: SearchFilter[],
  coords: LatLng | undefined,
  name?: string
) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [response, setResponse] = React.useState<SearchResponse<T>>();
  const [results, setResults] = React.useState<T[]>();
  const [isLoading, setLoading] = React.useState(false);
  // helpers
  const search = React.useCallback(
    (location: LatLng, input: string, filters: SearchFilter[], page?: number) => {
      (async () => {
        setLoading(true);
        setResponse(await api.search().search(kind, order, filters, location, input, page));
        setLoading(false);
      })();
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
  // debounce search when search input changes
  React.useEffect(() => {
    if (!enabled) return;
    if (name === undefined) return;
    if (!coords) return;
    debouncedSearch(coords, name, filters);
  }, [enabled, name, coords, debouncedSearch, filters]);
  // update results when response changes
  React.useEffect(() => {
    if (!response) return;
    const hits = response.hits;
    if (response.page === 0) setResults(hits);
    else setResults([...(results ?? []), ...hits]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);
  // result
  const fetchNextPage = React.useCallback(() => {
    if (name === undefined) return;
    if (!coords) return;
    if (!response) return;
    const hasNextPage = response.page + 1 < response.nbPages;
    if (hasNextPage) debouncedSearch(coords, name, filters, response.page + 1);
  }, [name, coords, response, debouncedSearch, filters]);

  return { results, isLoading, fetchNextPage };
};
