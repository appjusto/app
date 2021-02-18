import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch/lite';
import { Business, Fleet } from 'appjusto-types';
import { LatLng } from 'react-native-maps';
import { AlgoliaConfig } from '../../../utils/config';
import { SearchParam } from '../../consumer/types';

export default class SearchApi {
  private client: SearchClient;
  private restaurants: SearchIndex;
  private fleets: SearchIndex;

  constructor(config: AlgoliaConfig) {
    this.client = algoliasearch(config.appId, config.apiKey);
    this.restaurants = this.client.initIndex(`${config.env}_businesses`);
    this.fleets = this.client.initIndex(`${config.env}_fleets`);
  }

  searchRestaurants(
    aroundLocation: LatLng,
    query: string = '',
    filters?: SearchParam[],
    page?: number
  ) {
    console.log('searchRestaurants');
    console.log(filters);
    return this.restaurants.search<Business>(query, {
      aroundLatLng: `${aroundLocation.latitude}, ${aroundLocation.longitude}`,
      page,
    });
  }

  searchFleets(query: string = '', page?: number) {
    return this.fleets.search<Fleet>(query, {
      page,
    });
  }
}
