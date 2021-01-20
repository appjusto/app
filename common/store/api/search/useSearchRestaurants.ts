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
  // side effects
  const debouncedSearch = React.useCallback(
    debounce<(location: LatLng, input: string, page?: number) => void>(
      async (location, input, page) => {
        setResponse(await api.search().searchRestaurants(location, input, page));
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
    setRestaurants(response.hits.map((r) => ({ ...r, id: r.objectID } as WithId<Business>)));
  }, [response]);
  // result
  const fetchNextPage = React.useCallback(() => {
    if (search === undefined) return;
    if (!coords) return;
    if (!response) return;
    debouncedSearch(coords, search, response.page + 1);
  }, [search, coords, response]);

  return { restaurants, fetchNextPage };
};
