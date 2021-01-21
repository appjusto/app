import { SearchResponse } from '@algolia/client-search';
import { Business, LatLng, WithId } from 'appjusto-types';
import { debounce } from 'lodash';
import React from 'react';
import { ApiContext } from '../../../app/context';

export const useSearchRestaurants = (coords: LatLng | undefined, search?: string) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [response, setResponse] = React.useState<SearchResponse<Business>>();
  const [restaurants, setRestaurants] = React.useState<WithId<Business>[]>();
  const [isLoading, setLoading] = React.useState(false);
  // side effects
  const debouncedSearch = React.useCallback(
    debounce<(location: LatLng, input: string, page?: number) => void>(
      async (location, input, page) => {
        setLoading(true);
        setResponse(await api.search().searchRestaurants(location, input, page));
        setLoading(false);
      },
      500
    ),
    []
  );
  // debounce search when search input changes
  React.useEffect(() => {
    if (search === undefined) return;
    if (!coords) return;
    debouncedSearch(coords, search);
  }, [search, coords]);
  // update results when response changes
  React.useEffect(() => {
    if (!response) return;
    const hits = response.hits.map((r) => ({ ...r, id: r.objectID } as WithId<Business>));
    if (response.page === 0) setRestaurants(hits);
    else setRestaurants([...(restaurants ?? []), ...hits]);
  }, [response]);
  // result
  const fetchNextPage = React.useCallback(() => {
    if (search === undefined) return;
    if (!coords) return;
    if (!response) return;
    const hasNextPage = response.page + 1 < response.nbPages;
    if (hasNextPage) debouncedSearch(coords, search, response.page + 1);
  }, [search, coords, response]);

  return { restaurants, isLoading, fetchNextPage };
};
