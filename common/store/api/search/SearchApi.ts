import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch/lite';
import { Business, WithId } from 'appjusto-types';
import { LatLng } from 'react-native-maps';
import { AlgoliaConfig } from '../../../utils/config';

export default class SearchApi {
  private client: SearchClient;
  private restaurants: SearchIndex;

  constructor(config: AlgoliaConfig) {
    console.log(config);
    this.client = algoliasearch(config.appId, config.apiKey);
    this.restaurants = this.client.initIndex('dev_businesses');
  }

  async searchRestaurants(aroundLocation: LatLng, query: string = '') {
    const result = await this.restaurants.search<Partial<Business>>(query, {
      aroundLatLng: `${aroundLocation.latitude}, ${aroundLocation.longitude}`,
    });
    return result.hits.map((r) => ({ ...r, id: r.objectID } as WithId<Business>));
  }
}
