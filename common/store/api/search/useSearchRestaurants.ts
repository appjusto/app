import { SearchResponse } from '@algolia/client-search';
import { Business, LatLng, WithId } from 'appjusto-types';
import { debounce } from 'lodash';
import React from 'react';
import { ApiContext } from '../../../app/context';
import { SearchParam } from '../../consumer/types';

export const useSearchRestaurants = (
  coords: LatLng | undefined,
  name?: string,
  filters?: SearchParam[]
) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [response, setResponse] = React.useState<SearchResponse<Business>>();
  const [restaurants, setRestaurants] = React.useState<WithId<Business>[]>();
  const [isLoading, setLoading] = React.useState(false);
  // side effects
  const search = async (
    location: LatLng,
    input: string,
    filters?: SearchParam[],
    page?: number
  ) => {
    setLoading(true);
    setResponse(await api.search().searchRestaurants(location, input, filters, page));
    setLoading(false);
  };
  const debouncedSearch = React.useCallback(
    debounce<(location: LatLng, input: string, filters?: SearchParam[], page?: number) => void>(
      search,
      500
    ),
    []
  );
  // debounce search when search input changes
  React.useEffect(() => {
    if (name === undefined) return;
    if (!coords) return;
    debouncedSearch(coords, name, filters);
  }, [coords, name, filters, debouncedSearch]);
  // update results when response changes
  React.useEffect(() => {
    if (!response) return;
    const hits = response.hits.map((r) => ({ ...r, id: r.objectID } as WithId<Business>));
    if (response.page === 0) setRestaurants(hits);
    else setRestaurants([...(restaurants ?? []), ...hits]);
  }, [response]);
  // result
  const fetchNextPage = React.useCallback(() => {
    if (name === undefined) return;
    if (!coords) return;
    if (!response) return;
    const hasNextPage = response.page + 1 < response.nbPages;
    if (hasNextPage) debouncedSearch(coords, name, filters, response.page + 1);
  }, [name, coords, response]);

  return { restaurants, isLoading, fetchNextPage };
};
